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
    return jsonify([p.to_dict() for p in products])


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

    return jsonify(
        {
            "product": product.to_dict(),
            "quantity": 1,
            "rationale": (
                "Enough VRAM to run mid-size open models locally, no data "
                "center needed."
            ),
            "total_price": float(product.price_usd),
        }
    )


@app.route("/api/recommend/midsize")
def recommend_midsize():
    product = Product.query.filter_by(name="NVIDIA H100 SXM").first()
    if product is None:
        return jsonify({"error": "recommended product not found"}), 404

    quantity = 4
    return jsonify(
        {
            "product": product.to_dict(),
            "quantity": quantity,
            "rationale": (
                "Enough combined VRAM to run large open-source models with "
                "room for multiple concurrent workloads."
            ),
            "total_price": float(product.price_usd) * quantity,
        }
    )


if __name__ == "__main__":
    app.run(debug=True, port=5001)
