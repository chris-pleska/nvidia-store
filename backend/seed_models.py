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
        about_developer=(
            "Z.ai (formerly Zhipu AI) is a Beijing-based AI lab spun out "
            "of Tsinghua University, known for releasing some of the "
            "strongest fully open-source models under permissive "
            "licenses."
        ),
        best_for=(
            "Agentic tool use and general reasoning — one of the "
            "top-ranked open models for tasks where the AI needs to "
            "operate software and take multi-step actions."
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
        about_developer=(
            "DeepSeek is a Chinese AI lab famous for shocking the "
            "industry with frontier-level open models at a fraction of "
            "typical training costs. Their releases are fully "
            "MIT-licensed."
        ),
        best_for=(
            "Maximum capability — the largest open-weight model in our "
            "lineup. Choose this when you want the strongest reasoning "
            "available and have the hardware budget to match."
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
        about_developer=(
            "DeepSeek is a Chinese AI lab famous for shocking the "
            "industry with frontier-level open models at a fraction of "
            "typical training costs. Their releases are fully "
            "MIT-licensed."
        ),
        best_for=(
            "The best capability-per-dollar in our lineup — strong "
            "everyday performance at a fraction of the hardware cost of "
            "the flagship models. The sensible starting point for most "
            "companies."
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
        about_developer=(
            "Moonshot AI is a Beijing-based lab founded in 2023 by "
            "Tsinghua alumni, focused on agentic AI. Their K2 model "
            "family competes directly with the top closed models on "
            "coding benchmarks."
        ),
        best_for=(
            "Long-running autonomous coding and multi-agent work — it "
            "can run for hours on complex software tasks and coordinate "
            "hundreds of sub-agents. The open model of choice for "
            "AI-powered software engineering."
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
        about_developer=(
            "Qwen is Alibaba Cloud's AI model family — one of the most "
            "prolific open-source AI efforts in the world, with models "
            "spanning from phone-sized to frontier-scale, all under "
            "Apache 2.0."
        ),
        best_for=(
            "Multimodal work and multilingual deployments — it natively "
            "understands text, images, and video across 201 languages, "
            "while its sparse design keeps running costs low for its "
            "size."
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
