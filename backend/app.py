import math
import os

from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from sqlalchemy import text

from extensions import db
from models import OpenSourceModel, Product

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
        "A cluster is multiple GPUs or machines connected together and "
        "coordinated to work on the same task as if they were one larger "
        "system."
    ),
    "honest_difference": (
        "Real datacenter clustering (like NVLink-connected H100s or a GB200 "
        "NVL72 rack) uses dedicated high-speed interconnects so GPUs can "
        "share memory and work together with very low latency. Plugging "
        "multiple desktop GPUs into one PC does not create this — each card "
        "runs mostly on its own over the much slower PCIe bus, with far more "
        "communication overhead and no unified memory pool. A pile of "
        "desktop cards is not a real cluster."
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


if __name__ == "__main__":
    app.run(debug=True, port=5001)
