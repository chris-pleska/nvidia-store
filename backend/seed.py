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
            "The card most people mean when they say 'gaming GPU.' The "
            "fastest thing you can put in a normal desktop PC — great for "
            "gaming, and enough to experiment with smaller AI models at "
            "home."
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
            "A professional workstation card with three times the memory of "
            "a gaming card. For people who run AI models, 3D rendering, or "
            "simulations at their desk — no server room required."
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
            "A single datacenter-grade AI GPU — the kind that gets wired "
            "into 8-GPU servers. This is the chip that powered the first "
            "wave of the AI boom."
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
            "A complete 8-GPU AI server — you buy the whole box, plug it "
            "in, and it works. The standard building block of serious AI "
            "infrastructure."
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
            "A full liquid-cooled rack: 72 GPUs wired together so tightly "
            "they act like one giant machine. This is what 'AI datacenter' "
            "actually looks like."
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
            "The most powerful GPU you can get inside a laptop. Sold only "
            "pre-installed in gaming and creator laptops — you can't buy "
            "the chip on its own."
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
            "The H100's bigger-memory sibling: same generation, nearly "
            "twice the memory per chip. Built for AI models too large to "
            "fit in an H100."
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
            "NVIDIA's current-generation datacenter GPU. Roughly 4x the AI "
            "training speed of an H100 — this is what new AI datacenters "
            "are being built around."
        ),
        image_url=None,
        specs={"memory_type": "HBM3e"},
        source_note="Specs per NVIDIA's datasheet; price is a market estimate.",
        price_is_estimate=True,
    ),
    dict(
        name="NVIDIA GB300 NVL72",
        category="Rack System",
        price_usd=4000000.00,
        power_watts=135000,
        vram_gb=20736,
        description=(
            "NVIDIA's current flagship rack: 72 Blackwell Ultra GPUs and "
            "36 Grace CPUs acting as one machine, with 21TB of pooled "
            "memory — built for the largest AI models in existence."
        ),
        image_url=None,
        specs={
            "gpu_count": 72,
            "gpu_model": "Blackwell Ultra (B300)",
            "cpu_count": 36,
            "cooling": "liquid",
            "memory_architecture": "unified",
            "memory_per_gpu_gb": 288,
            "interconnect": "5th-gen NVLink",
        },
        source_note=(
            "Specs per NVIDIA's GB300 NVL72 page and partner datasheets "
            "(72x 288GB HBM3e = ~21TB pooled, 5th-gen NVLink, "
            "liquid-cooled); price and power are market estimates — these "
            "systems are quoted per-deal."
        ),
        price_is_estimate=True,
        power_is_estimate=True,
    ),
    dict(
        name="NVIDIA RTX 5080",
        category="Desktop GPU",
        price_usd=999.00,
        power_watts=360,
        vram_gb=16,
        description=(
            "The sensible flagship: excellent 4K gaming and light AI work "
            "at half the price of the 5090. The card to get if the 5090 is "
            "overkill for you."
        ),
        image_url=None,
        specs={"memory_type": "GDDR7"},
        source_note=(
            "Specs per NVIDIA's product page; $999 is NVIDIA's MSRP — "
            "street prices currently run $1,200-1,300 due to memory "
            "shortages."
        ),
    ),
    dict(
        name="NVIDIA RTX 5080 Laptop GPU",
        category="Laptop GPU",
        price_usd=3200.00,
        power_watts=175,
        vram_gb=16,
        description=(
            "The step-down mobile flagship: strong gaming and creative "
            "performance in thinner, cheaper laptops than the 5090 tier. "
            "Sold only inside laptops."
        ),
        image_url=None,
        specs={"memory_type": "GDDR7"},
        source_note=(
            "Specs per NVIDIA's mobile GPU page; price reflects a "
            "representative laptop configuration — market range roughly "
            "$2,500-5,000 depending on the laptop."
        ),
        price_is_estimate=True,
    ),
    dict(
        name="NVIDIA DGX B200",
        category="Server",
        price_usd=450000.00,
        power_watts=10200,
        vram_gb=1440,
        description=(
            "The current-generation 8-GPU AI server: one box with more "
            "than double the memory of the DGX H100, built around "
            "Blackwell GPUs."
        ),
        image_url=None,
        specs={"gpu_count": 8, "gpu_model": "B200"},
        source_note=(
            "Specs per NVIDIA's DGX B200 datasheet; price is a market "
            "estimate — reported system sales range $300,000-600,000 "
            "depending on configuration and support contracts."
        ),
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
