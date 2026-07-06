from app import app
from extensions import db
from models import OpenSourceModel

MODELS = [
    dict(
        name="GLM-5.2 (Max)",
        developer_lab="Z.ai",
        license="MIT",
        param_count_billions=753,
        context_window=1_000_000,
        short_description=(
            "A large mixture-of-experts model from Z.ai, ranked among the top "
            "open-weight models for agentic tool use."
        ),
    ),
    dict(
        name="DeepSeek V4 Pro",
        developer_lab="DeepSeek",
        license="MIT",
        param_count_billions=1600,
        context_window=1_000_000,
        short_description=(
            "DeepSeek's flagship open-weight model, the largest currently "
            "available MIT-licensed model."
        ),
    ),
    dict(
        name="DeepSeek V4 Flash",
        developer_lab="DeepSeek",
        license="MIT",
        param_count_billions=284,
        context_window=1_000_000,
        short_description=(
            "A smaller, faster sibling to V4 Pro, offering strong performance "
            "at a fraction of the hardware cost."
        ),
    ),
]


def seed():
    with app.app_context():
        OpenSourceModel.query.delete()
        for data in MODELS:
            db.session.add(OpenSourceModel(**data))
        db.session.commit()
        print(f"Seeded {len(MODELS)} open source models.")


if __name__ == "__main__":
    seed()
