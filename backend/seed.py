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
        source_note=(
            "Specs per NVIDIA's official product page; $1,999 is NVIDIA's "
            "launch MSRP (street prices often run higher)."
        ),
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
        source_note=(
            "Specs per NVIDIA's product page; price per major workstation "
            "retailer listings."
        ),
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
        source_note=(
            "Specs per NVIDIA's datasheet; price is a market estimate — "
            "NVIDIA doesn't publish list prices for datacenter GPUs."
        ),
        price_is_estimate=True,
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
        source_note=(
            "Specs per NVIDIA's DGX datasheet; price is a market estimate "
            "based on reported system sales."
        ),
        price_is_estimate=True,
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
        source_note=(
            "Specs per NVIDIA's rack datasheet; price and power are market "
            "estimates — these systems are quoted per-deal."
        ),
        price_is_estimate=True,
        power_is_estimate=True,
    ),
    dict(
        name="NVIDIA RTX 5090 Laptop GPU",
        category="Laptop GPU",
        price_usd=3999.00,
        power_watts=175,
        vram_gb=24,
        description=(
            "NVIDIA's flagship mobile GPU, sold only pre-installed in "
            "gaming/creator laptops rather than as a standalone card — price "
            "reflects a representative laptop configuration, not the chip "
            "alone."
        ),
        image_url=None,
        specs={"memory_type": "GDDR7"},
        source_note=(
            "Specs per NVIDIA's mobile GPU page; price reflects a "
            "representative laptop configuration, since mobile GPUs aren't "
            "sold standalone."
        ),
        price_is_estimate=True,
    ),
    dict(
        name="NVIDIA H200",
        category="Datacenter GPU",
        price_usd=38000.00,
        power_watts=700,
        vram_gb=141,
        description=(
            "A memory-upgraded version of the H100 on the same architecture, "
            "built for large language models that need more than 80GB per "
            "GPU."
        ),
        image_url=None,
        specs={"memory_type": "HBM3e"},
        source_note="Specs per NVIDIA's datasheet; price is a market estimate.",
        price_is_estimate=True,
    ),
    dict(
        name="NVIDIA B200",
        category="Datacenter GPU",
        price_usd=47000.00,
        power_watts=1000,
        vram_gb=180,
        description=(
            "NVIDIA's current-generation Blackwell datacenter GPU, roughly 4x "
            "the AI training throughput of the H100 with native FP4 "
            "precision support."
        ),
        image_url=None,
        specs={"memory_type": "HBM3e"},
        source_note="Specs per NVIDIA's datasheet; price is a market estimate.",
        price_is_estimate=True,
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
