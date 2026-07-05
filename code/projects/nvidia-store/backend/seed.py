from app import app
from extensions import db
from models import Product

PRODUCTS = [
    dict(
        name="NVIDIA RTX 5090",
        category="Desktop GPU",
        price_usd=1999.00,
        power_watts=575,
        vram_gb=32,
        description=(
            "NVIDIA's flagship consumer GPU, built for high-end gaming and AI "
            "development on a single desktop."
        ),
        image_url=None,
        specs={"memory_type": "GDDR7"},
    ),
    dict(
        name="NVIDIA RTX PRO 6000 Blackwell (Workstation Edition)",
        category="Professional GPU",
        price_usd=8565.00,
        power_watts=600,
        vram_gb=96,
        description=(
            "Workstation-class GPU for professionals running local AI models, "
            "3D rendering, and simulation without a data center."
        ),
        image_url=None,
        specs={"memory_type": "GDDR7"},
    ),
    dict(
        name="NVIDIA H100 SXM",
        category="Datacenter GPU",
        price_usd=30000.00,
        power_watts=700,
        vram_gb=80,
        description=(
            "The industry-standard datacenter GPU for large-scale AI training and "
            "inference, deployed via NVLink in multi-GPU servers."
        ),
        image_url=None,
        specs={"memory_type": "HBM3", "interconnect": "NVLink"},
    ),
    dict(
        name="NVIDIA DGX H100",
        category="Server",
        price_usd=350000.00,
        power_watts=10200,
        vram_gb=640,
        description=(
            "A complete 8-GPU server appliance combining H100 GPUs, CPUs, "
            "networking, and storage in one turnkey system for AI training."
        ),
        image_url=None,
        specs={"gpu_count": 8, "gpu_model": "H100"},
    ),
    dict(
        name="NVIDIA GB200 NVL72",
        category="Rack System",
        price_usd=2500000.00,
        power_watts=120000,
        vram_gb=13500,
        description=(
            "A liquid-cooled, rack-scale system connecting 72 Blackwell GPUs as a "
            "single unified accelerator for trillion-parameter model training."
        ),
        image_url=None,
        specs={
            "gpu_count": 72,
            "gpu_model": "Blackwell",
            "cooling": "liquid",
            "memory_architecture": "unified",
        },
    ),
]


def seed():
    with app.app_context():
        Product.query.delete()
        for data in PRODUCTS:
            db.session.add(Product(**data))
        db.session.commit()
        print(f"Seeded {len(PRODUCTS)} products.")


if __name__ == "__main__":
    seed()
