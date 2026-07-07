import json
import math
import os
import time
from collections import defaultdict

import anthropic
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate
from sqlalchemy import text

from extensions import db
from models import OpenSourceModel, Product, QuoteRequest

# Only single-GPU products are viable build recommendations — multi-GPU
# aggregates like "Rack System" or "Server" would trivially "win" on unit
# count (e.g. 1x rack always beats Nx individual GPUs) regardless of cost.
RECOMMENDATION_CANDIDATE_CATEGORIES = ["Datacenter GPU"]

HOME_CONTINUOUS_DRAW_WATTS = 1200
EV_BATTERY_KWH = 90


def humanize_power(watts):
    if watts is None:
        return None

    return {
        "homes_equivalent": round(watts / HOME_CONTINUOUS_DRAW_WATTS, 1),
        "ev_battery_fraction": round((watts / 1000) / EV_BATTERY_KWH, 4),
    }


CLUSTER_EXPLAINER = {
    "definition": (
        "A cluster is multiple computers wired together to act like one "
        "bigger machine."
    ),
    "real_clustering": (
        "Real datacenter clustering — NVLink between GPUs, InfiniBand "
        "between servers — is fast enough that many GPUs behave like one "
        "big GPU with combined memory. This is how a rack runs a model "
        "bigger than any single GPU's memory."
    ),
    "honest_contrast": (
        "Several desktop cards in one PC only talk over regular PCIe, far "
        "slower and with no unified memory — not something we'd sell as a "
        "production cluster build."
    ),
}

RATE_LIMIT_WINDOW_SECONDS = 60
RATE_LIMIT_MAX_REQUESTS = 5
_rate_limit_hits = defaultdict(list)


def check_rate_limit(client_ip):
    now = time.time()
    hits = _rate_limit_hits[client_ip]
    cutoff = now - RATE_LIMIT_WINDOW_SECONDS

    while hits and hits[0] < cutoff:
        hits.pop(0)

    if len(hits) >= RATE_LIMIT_MAX_REQUESTS:
        return False

    hits.append(now)
    return True


load_dotenv()

# Reads ANTHROPIC_API_KEY from the environment automatically.
anthropic_client = anthropic.Anthropic()

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DATABASE_URL"]

CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})

db.init_app(app)
migrate = Migrate(app, db)


@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.route("/api/db-check")
def db_check():
    db.session.execute(text("SELECT 1"))
    return jsonify({"database": "connected"})


@app.route("/api/ai-test")
def ai_test():
    message = anthropic_client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=64,
        messages=[{"role": "user", "content": "Say hello in 5 words"}],
    )
    return jsonify({"response": message.content[0].text})


def build_ai_recommend_system_prompt(products, models):
    catalog = [
        {
            "name": product.name,
            "category": product.category,
            "price_usd": float(product.price_usd),
            "vram_gb": product.vram_gb,
            "power_watts": product.power_watts,
        }
        for product in products
    ]

    model_catalog = [
        {
            "name": model.name,
            "param_count_billions": model.param_count_billions,
            "required_memory_gb": model.to_dict()["required_memory_gb"],
        }
        for model in models
    ]

    return (
        "You are a hardware recommendation assistant for an NVIDIA hardware "
        "store. Here is the full product catalog, as JSON:\n\n"
        f"{json.dumps(catalog, indent=2)}\n\n"
        "Here is the catalog of open-source AI models customers might "
        "mention, as JSON:\n\n"
        f"{json.dumps(model_catalog, indent=2)}\n\n"
        "Rules:\n"
        "- Recommend ONLY products from this exact list. Never invent "
        "products, specs, or prices that aren't in the catalog above.\n"
        "- Use the exact \"name\" field from the catalog for every "
        "recommended product.\n"
        "- If multiple units of a product are needed, reflect that in the "
        "\"quantity\" field.\n"
        "- If the customer mentions running a specific AI model, the "
        "combined VRAM of your recommended products MUST meet or exceed "
        "that model's required_memory_gb (params × 1GB × 1.2). Never "
        "recommend a build with less total VRAM than the model requires. "
        "Only Datacenter GPU and Rack System products are appropriate for "
        "models requiring more than 96GB.\n"
        "- Among builds that meet the memory requirement, prefer the one "
        "with the lowest total price. Do not claim a build is the most "
        "cost-effective unless it actually has the lowest total price "
        "among valid options.\n"
        "- Briefly explain the recommendation in plain language a "
        "non-technical buyer would understand.\n"
        "- Respond with ONLY a single strict JSON object in exactly this "
        "shape, no markdown formatting, code fences, or extra text before "
        "or after it:\n"
        '{"recommended_products": [{"name": "...", "quantity": N}], '
        '"reasoning": "...", "total_price": N}'
    )


def required_memory_gb_of(model):
    if model.param_count_billions is None:
        return None
    return round(model.param_count_billions * 1 * 1.2)


def find_matched_model(prompt, models):
    prompt_lower = prompt.lower()
    matches = [model for model in models if model.name.lower() in prompt_lower]
    if not matches:
        return None
    return max(matches, key=lambda model: len(model.name))


def combined_vram_of(recommended_products, catalog_by_name):
    total = 0
    for item in recommended_products:
        product = catalog_by_name[item["name"]]
        total += (product.vram_gb or 0) * int(item["quantity"])
    return total


def extract_json_object(text):
    text = text.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:]
        text = text.strip()

    # Claude sometimes "thinks out loud" before the JSON object despite
    # instructions not to — pull out just the {...} span rather than
    # assuming the whole response is clean JSON.
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        return text[start : end + 1]

    return text


def parse_and_validate_recommendation(raw_text, catalog_by_name):
    try:
        data = json.loads(extract_json_object(raw_text))
    except (json.JSONDecodeError, TypeError):
        return None, "response was not valid JSON"

    if not isinstance(data, dict):
        return None, "response was not a JSON object"

    products = data.get("recommended_products")
    if not isinstance(products, list) or len(products) == 0:
        return None, "recommended_products was missing or empty"

    for item in products:
        if not isinstance(item, dict) or "name" not in item or "quantity" not in item:
            return None, "a recommended product entry was malformed"
        if item["name"] not in catalog_by_name:
            return None, f"unknown product name: {item['name']!r}"
        quantity = item["quantity"]
        if not isinstance(quantity, (int, float)) or quantity <= 0:
            return None, f"invalid quantity for {item['name']!r}"

    if not isinstance(data.get("reasoning"), str) or not data["reasoning"].strip():
        return None, "reasoning was missing or empty"

    return data, None


@app.route("/api/ai-recommend", methods=["POST"])
def ai_recommend():
    if not check_rate_limit(request.remote_addr):
        return (
            jsonify(
                {
                    "error": (
                        f"Rate limit exceeded — max {RATE_LIMIT_MAX_REQUESTS} "
                        f"requests per {RATE_LIMIT_WINDOW_SECONDS} seconds."
                    )
                }
            ),
            429,
        )

    data = request.get_json(silent=True) or {}
    prompt = data.get("prompt")
    if not prompt or not isinstance(prompt, str):
        return jsonify({"error": "missing required field: prompt"}), 400

    products = Product.query.all()
    models = OpenSourceModel.query.all()
    catalog_by_name = {product.name: product for product in products}
    system_prompt = build_ai_recommend_system_prompt(products, models)
    matched_model = find_matched_model(prompt, models)
    matched_model_required_gb = (
        required_memory_gb_of(matched_model) if matched_model else None
    )

    deterministic_baseline = None
    if matched_model is not None:
        candidates = Product.query.filter(
            Product.category.in_(RECOMMENDATION_CANDIDATE_CATEGORIES)
        ).all()
        deterministic_baseline = recommend_product(
            matched_model_required_gb, candidates
        )

    def ask_claude(user_content):
        message = anthropic_client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            system=system_prompt,
            messages=[{"role": "user", "content": user_content}],
        )
        return message.content[0].text

    def check_model_fit(parsed_data):
        if parsed_data is None or matched_model is None:
            return None

        combined_vram = combined_vram_of(
            parsed_data["recommended_products"], catalog_by_name
        )
        if combined_vram < matched_model_required_gb:
            return (
                f"the recommended build only has {combined_vram}GB combined "
                f"VRAM, but {matched_model.name} requires at least "
                f"{matched_model_required_gb}GB"
            )

        if deterministic_baseline is not None:
            ai_total_price = sum(
                float(catalog_by_name[item["name"]].price_usd) * int(item["quantity"])
                for item in parsed_data["recommended_products"]
            )
            if ai_total_price > deterministic_baseline["total_price"]:
                return (
                    f"the recommended build costs ${ai_total_price:,.0f}, but "
                    f"a cheaper option that also meets the "
                    f"{matched_model_required_gb}GB requirement exists: "
                    f"{deterministic_baseline['units_needed']}x "
                    f"{deterministic_baseline['product_name']} for "
                    f"${deterministic_baseline['total_price']:,.0f}"
                )

        return None

    raw_response = ask_claude(prompt)
    parsed, error = parse_and_validate_recommendation(raw_response, catalog_by_name)
    fit_error = check_model_fit(parsed)

    if parsed is None or fit_error:
        retry_reason = error or fit_error
        retry_prompt = (
            f"{prompt}\n\n"
            f"Your previous response was invalid: {retry_reason}. Respond "
            "again with ONLY the strict JSON object described in the "
            "system prompt, using exact product names from the catalog, "
            "make sure the combined VRAM meets the mentioned model's "
            "required_memory_gb, and use the cheapest valid option. Do not "
            "show your calculations or reasoning outside the JSON object — "
            "output the JSON object and nothing else."
        )
        raw_response = ask_claude(retry_prompt)
        parsed, error = parse_and_validate_recommendation(raw_response, catalog_by_name)
        fit_error = check_model_fit(parsed)

    if parsed is None:
        return (
            jsonify({"error": f"AI recommendation failed validation: {error}"}),
            502,
        )

    if fit_error and matched_model is not None:
        fallback = deterministic_baseline

        if fallback is None:
            return (
                jsonify(
                    {
                        "error": (
                            "no viable product found to meet "
                            f"{matched_model.name}'s VRAM requirement"
                        )
                    }
                ),
                502,
            )

        return jsonify(
            {
                "recommended_products": [
                    {
                        "name": fallback["product_name"],
                        "quantity": fallback["units_needed"],
                        "price_usd": float(
                            catalog_by_name[fallback["product_name"]].price_usd
                        ),
                        "subtotal": fallback["total_price"],
                    }
                ],
                "reasoning": (
                    "The AI's recommendation didn't meet our bar for "
                    f"{matched_model.name} (needs at least "
                    f"{matched_model_required_gb}GB combined VRAM at the "
                    "lowest valid price). Falling back to our deterministic "
                    f"recommendation: {fallback['units_needed']}x "
                    f"{fallback['product_name']} provides "
                    f"{fallback['combined_vram_gb']}GB combined VRAM for "
                    f"${fallback['total_price']:,.0f}."
                ),
                "total_price": fallback["total_price"],
            }
        )

    recommended_products = []
    total_price = 0.0
    for item in parsed["recommended_products"]:
        product = catalog_by_name[item["name"]]
        quantity = int(item["quantity"])
        subtotal = float(product.price_usd) * quantity
        total_price += subtotal
        recommended_products.append(
            {
                "name": product.name,
                "quantity": quantity,
                "price_usd": float(product.price_usd),
                "subtotal": subtotal,
            }
        )

    return jsonify(
        {
            "recommended_products": recommended_products,
            "reasoning": parsed["reasoning"],
            "total_price": total_price,
        }
    )


@app.route("/api/products")
def get_products():
    products = Product.query.all()

    result = []
    for product in products:
        data = product.to_dict()
        data["power_context"] = humanize_power(data["power_watts"])
        result.append(data)

    return jsonify(result)


def recommend_product(required_memory_gb, candidates):
    if required_memory_gb is None:
        return None

    best = None
    best_product = None
    for product in candidates:
        if not product.vram_gb:
            continue

        units_needed = math.ceil(required_memory_gb / product.vram_gb)
        total_price = units_needed * float(product.price_usd)

        if (
            best is None
            or units_needed < best["units_needed"]
            or (units_needed == best["units_needed"] and total_price < best["total_price"])
        ):
            best = {
                "product_name": product.name,
                "vram_gb_per_unit": product.vram_gb,
                "units_needed": units_needed,
                "total_price": total_price,
            }
            best_product = product

    if best is None:
        return None

    stats = calculate_cluster_stats(best_product, best["units_needed"])
    best["combined_vram_gb"] = stats["combined_vram_gb"]
    best["combined_power_watts"] = stats["combined_power_watts"]
    best["combined_power_context"] = humanize_power(stats["combined_power_watts"])
    best["price_is_estimate"] = best_product.price_is_estimate
    best["power_is_estimate"] = best_product.power_is_estimate

    return best


@app.route("/api/models")
def get_models():
    models = OpenSourceModel.query.all()
    candidates = Product.query.filter(
        Product.category.in_(RECOMMENDATION_CANDIDATE_CATEGORIES)
    ).all()

    result = []
    for model in models:
        data = model.to_dict()
        data["recommended_product"] = recommend_product(
            data["required_memory_gb"], candidates
        )
        result.append(data)

    return jsonify(result)


@app.route("/api/recommend/startup")
def recommend_startup():
    product = Product.query.filter_by(
        name="NVIDIA RTX PRO 6000 Blackwell (Workstation Edition)"
    ).first()
    if product is None:
        return jsonify({"error": "recommended product not found"}), 404

    product_data = product.to_dict()
    product_data["power_context"] = humanize_power(product_data["power_watts"])

    return jsonify(
        {
            "product": product_data,
            "quantity": 1,
            "rationale": (
                "Enough VRAM to run mid-size open models locally, no data "
                "center needed."
            ),
            "total_price": float(product.price_usd),
        }
    )


def calculate_cluster_stats(product, quantity):
    return {
        "combined_vram_gb": product.vram_gb * quantity,
        "combined_power_watts": product.power_watts * quantity,
        "total_price": float(product.price_usd) * quantity,
    }


@app.route("/api/recommend/midsize")
def recommend_midsize():
    product = Product.query.filter_by(name="NVIDIA H100 SXM").first()
    if product is None:
        return jsonify({"error": "recommended product not found"}), 404

    quantity = 4
    stats = calculate_cluster_stats(product, quantity)

    product_data = product.to_dict()
    product_data["power_context"] = humanize_power(product_data["power_watts"])

    return jsonify(
        {
            "product": product_data,
            "quantity": quantity,
            "rationale": (
                "Enough combined VRAM to run large open-source models with "
                "room for multiple concurrent workloads."
            ),
            **stats,
            "combined_power_context": humanize_power(stats["combined_power_watts"]),
            "cluster_explainer": CLUSTER_EXPLAINER,
        }
    )


@app.route("/api/cluster-explainer")
def get_cluster_explainer():
    return jsonify(CLUSTER_EXPLAINER)


QUOTE_REQUEST_REQUIRED_FIELDS = [
    "customer_name",
    "customer_contact",
    "build_description",
    "total_price_usd",
]


@app.route("/api/quote-requests", methods=["GET"])
def list_quote_requests():
    quote_requests = QuoteRequest.query.order_by(QuoteRequest.created_at.desc()).all()
    return jsonify([qr.to_dict() for qr in quote_requests])


@app.route("/api/quote-requests", methods=["POST"])
def create_quote_request():
    data = request.get_json(silent=True) or {}

    missing = [field for field in QUOTE_REQUEST_REQUIRED_FIELDS if not data.get(field)]
    if missing:
        return jsonify({"error": f"missing required fields: {', '.join(missing)}"}), 400

    next_number = 1000 + QuoteRequest.query.count() + 1
    request_number = f"REQ-{next_number:04d}"

    quote_request = QuoteRequest(
        request_number=request_number,
        customer_name=data["customer_name"],
        customer_contact=data["customer_contact"],
        build_description=data["build_description"],
        total_price_usd=data["total_price_usd"],
    )
    db.session.add(quote_request)
    db.session.commit()

    return jsonify(quote_request.to_dict()), 201


if __name__ == "__main__":
    app.run(debug=True, port=5001)
