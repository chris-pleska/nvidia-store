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
        source_note=(
            "The official Hugging Face model card "
            "(huggingface.co/zai-org/GLM-5.2) lists 753B total parameters "
            "and an MIT license."
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
        source_note=(
            "The official Hugging Face model card "
            "(huggingface.co/deepseek-ai) lists 1.6T total parameters and "
            "an MIT license."
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
        source_note=(
            "The official Hugging Face model card "
            "(huggingface.co/deepseek-ai/DeepSeek-V4-Flash) lists 284B "
            "parameters and an MIT license."
        ),
    ),
    dict(
        name="Kimi K2.6",
        developer_lab="Moonshot AI",
        license="Modified MIT",
        param_count_billions=1000,
        context_window=262_144,
        short_description=(
            "Moonshot AI's flagship open-weight agentic model: a "
            "1-trillion-parameter mixture-of-experts built for "
            "long-horizon coding and multi-agent orchestration, matching "
            "frontier closed models on coding benchmarks."
        ),
        source_note=(
            "The official Hugging Face model card "
            "(huggingface.co/moonshotai/Kimi-K2.6) lists 1T total "
            "parameters (32B active) under a Modified MIT license."
        ),
    ),
    dict(
        name="Qwen3.5-397B-A17B",
        developer_lab="Alibaba (Qwen)",
        license="Apache 2.0",
        param_count_billions=397,
        context_window=262_144,
        short_description=(
            "Alibaba's flagship open-weight multimodal model: 397B total "
            "parameters activating only 17B per token, delivering "
            "frontier-level reasoning and vision at low inference cost, "
            "in 201 languages."
        ),
        source_note=(
            "Model card (huggingface.co/Qwen) lists 397B total parameters "
            "(17B active) under Apache 2.0."
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
