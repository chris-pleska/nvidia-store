import math
import os

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

load_dotenv()

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
