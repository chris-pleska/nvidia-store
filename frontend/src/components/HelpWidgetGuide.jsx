import { useState } from "react";
import { Link } from "react-router-dom";

const REQUEST_QUOTE_OFFER = {
  text: "Or describe what you want in your own words and get an AI-generated build →",
  cta: { label: "Describe your build", to: "/request-quote" },
};

const STEPS = {
  start: {
    type: "question",
    greeting: "Hi! Not sure what you need? Let's figure it out.",
    question: "What are you looking for?",
    options: [
      { label: "I want a GPU for gaming or home use", next: "gaming" },
      { label: "I want to run AI models", next: "ai-models" },
      { label: "I'm buying for a company", next: "company" },
      { label: "I don't understand the terms on this site", next: "confused" },
      { label: "What's the deal with power usage?", next: "power-usage" },
      { label: "I just want to browse", next: "browsing" },
    ],
  },

  // Branch 1: gaming / home use
  gaming: {
    type: "question",
    question: "Desktop or laptop?",
    options: [
      { label: "Desktop", next: "gaming-desktop" },
      { label: "Laptop", next: "gaming-laptop" },
    ],
  },
  "gaming-desktop": {
    type: "answer",
    text: "Get the NVIDIA RTX 5090 — it's the fastest GPU you can put in a normal desktop PC, great for gaming and enough to experiment with smaller AI models at home. $1,999.",
    ctas: [{ label: "View in Shop", to: "/shop#desktop-gpu" }],
  },
  "gaming-laptop": {
    type: "answer",
    text: "Get the NVIDIA RTX 5090 Laptop GPU — the most powerful GPU you can get inside a laptop, around $3,999 for a representative configuration. Note: it comes pre-installed inside a laptop — you can't buy the chip on its own.",
    ctas: [{ label: "View in Shop", to: "/shop#laptop-gpu" }],
  },

  // Branch 2: run AI models
  "ai-models": {
    type: "question",
    question: "Do you know which model you want to run?",
    options: [
      { label: "Yes, I know the model", next: "ai-model-known" },
      { label: "No, help me pick", next: "ai-model-budget" },
    ],
  },
  "ai-model-known": {
    type: "answer",
    text: "Our Model Advisor shows the minimum hardware for each model, with the math visible.",
    ctas: [{ label: "Go to Model Advisor", to: "/model-advisor" }],
    secondaryOffer: REQUEST_QUOTE_OFFER,
  },
  "ai-model-budget": {
    type: "question",
    question: "Rough budget?",
    options: [
      { label: "Under $10k", next: "budget-low" },
      { label: "$10k–$100k", next: "budget-mid" },
      { label: "$100k+", next: "budget-high" },
    ],
  },
  "budget-low": {
    type: "answer",
    text: "Consider the NVIDIA RTX PRO 6000 Blackwell — a professional workstation card with three times the memory of a gaming card, enough to run mid-size open models locally without a data center. $8,565.",
    ctas: [{ label: "View in Shop", to: "/shop#professional-gpu" }],
    secondaryOffer: REQUEST_QUOTE_OFFER,
  },
  "budget-mid": {
    type: "answer",
    text: "A small H200 or B200 setup fits this range — enough combined VRAM to run large open-source models with room to grow.",
    ctas: [{ label: "See the startup recommendation", to: "/help-me-choose" }],
    secondaryOffer: REQUEST_QUOTE_OFFER,
  },
  "budget-high": {
    type: "answer",
    text: "At this range, look at the mid-size cluster path or DGX/rack-scale options — this is where dedicated clusters and full systems come in.",
    ctas: [{ label: "See the mid-size recommendation", to: "/help-me-choose" }],
    secondaryOffer: REQUEST_QUOTE_OFFER,
  },

  // Branch 3: buying for a company
  company: {
    type: "question",
    question: "How big is the team?",
    options: [
      { label: "Small startup", next: "company-startup" },
      { label: "Mid-size", next: "company-midsize" },
      { label: "Large company / enterprise", next: "company-enterprise" },
      { label: "We need a custom setup", next: "company-custom" },
    ],
  },
  "company-startup": {
    type: "answer",
    text: "For a small startup, we'd point you to a single RTX PRO 6000 Blackwell — enough VRAM to run mid-size open models locally, no data center needed.",
    ctas: [{ label: "See the startup path", to: "/help-me-choose" }],
  },
  "company-midsize": {
    type: "answer",
    text: "For a mid-size team, we'd point you to a small GPU cluster with room to grow — and explain what a real cluster actually is (not just plugging in a few desktop cards).",
    ctas: [{ label: "See the mid-size path", to: "/help-me-choose" }],
  },
  "company-enterprise": {
    type: "answer",
    text: "For a large company or enterprise, we'd point you to datacenter-scale — a single rack-sized system, delivered as one vendor-installed machine.",
    ctas: [{ label: "See the enterprise path", to: "/help-me-choose" }],
  },
  "company-custom": {
    type: "answer",
    text: "For a custom setup, tell us what you need and we'll follow up with a real quote.",
    ctas: [{ label: "Request a Quote", to: "/request-quote" }],
  },

  // Branch 4: confused about terms
  confused: {
    type: "question",
    question: "Which one is confusing you?",
    options: [
      { label: "VRAM / memory", next: "confused-vram" },
      { label: "Watts / power", next: "confused-power" },
      { label: "Clusters", next: "confused-clusters" },
      { label: "Parameters (the B numbers)", next: "confused-parameters" },
      { label: "All of it", next: "confused-all" },
    ],
  },
  "confused-vram": {
    type: "answer",
    text: "RAM is your computer's general workspace; VRAM is memory built into the GPU itself. A model has to fit entirely in VRAM to run at full speed, which is usually the number that decides what hardware you need.",
    ctas: [{ label: "Read more", to: "/learn#ram-vs-vram" }],
  },
  "confused-power": {
    type: "answer",
    text: "Watts measure how much electricity a GPU draws while running — higher-end cards need bigger power supplies and generate more heat. It adds up fast once you're running more than one.",
    ctas: [{ label: "Read more", to: "/learn#power-supply" }],
  },
  "confused-clusters": {
    type: "answer",
    text: "A cluster is multiple computers wired together to act like one bigger machine.",
    ctas: [{ label: "Read more", to: "/learn#clusters" }],
  },
  "confused-parameters": {
    type: "answer",
    text: "Parameters are the adjustable values inside a model — roughly, how \"big\" or capable it is. More parameters usually means better capability, but also more memory and compute needed to run it.",
    ctas: [{ label: "See it in action", to: "/model-advisor" }],
  },
  "confused-all": {
    type: "answer",
    text: "No worries — we built a whole page for exactly this.",
    ctas: [{ label: "Go to Learn", to: "/learn" }],
  },

  // Branch 5: power usage
  "power-usage": {
    type: "answer",
    text: "Every build shows watts translated into everyday terms — average homes and EV batteries — so the numbers actually mean something.",
    ctas: [{ label: "Read more", to: "/learn#power-supply" }],
  },

  // Branch 6: browsing
  browsing: {
    type: "answer",
    text: "No pressure! Two good starting points:",
    ctas: [
      { label: "Browse the Shop", to: "/shop" },
      { label: "Learn the Hardware", to: "/learn" },
    ],
  },
};

export default function HelpWidgetGuide({ onNavigate }) {
  const [history, setHistory] = useState(["start"]);
  const currentKey = history[history.length - 1];
  const step = STEPS[currentKey];

  function goTo(next) {
    setHistory((current) => [...current, next]);
  }

  function goBack() {
    setHistory((current) => (current.length > 1 ? current.slice(0, -1) : current));
  }

  function restart() {
    setHistory(["start"]);
  }

  return (
    <div className="flex flex-col gap-3">
      {step.type === "question" && (
        <>
          {step.greeting && (
            <p className="text-sm text-neutral-300">{step.greeting}</p>
          )}
          <p className="text-sm font-medium text-neutral-100">
            {step.question}
          </p>
          <div className="flex flex-col gap-2">
            {step.options.map((option) => (
              <button
                key={option.next}
                type="button"
                onClick={() => goTo(option.next)}
                className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-left text-sm text-neutral-200 transition-colors hover:border-nvidia/50 hover:text-nvidia"
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}

      {step.type === "answer" && (
        <>
          <p className="text-sm text-neutral-300">{step.text}</p>
          <div className="flex flex-col gap-2">
            {step.ctas.map((cta) => (
              <Link
                key={cta.to}
                to={cta.to}
                onClick={onNavigate}
                className="rounded-md bg-nvidia px-3 py-2 text-center text-sm font-semibold text-neutral-950 transition-opacity hover:opacity-90"
              >
                {cta.label}
              </Link>
            ))}
          </div>

          {step.secondaryOffer && (
            <div className="mt-1 border-t border-neutral-800 pt-3">
              <p className="text-xs text-neutral-400">
                {step.secondaryOffer.text}
              </p>
              <Link
                to={step.secondaryOffer.cta.to}
                onClick={onNavigate}
                className="mt-1.5 inline-block text-xs font-medium text-nvidia hover:underline"
              >
                {step.secondaryOffer.cta.label}
              </Link>
            </div>
          )}
        </>
      )}

      {currentKey !== "start" && (
        <div className="mt-2 flex items-center justify-between border-t border-neutral-800 pt-3 text-xs">
          <button
            type="button"
            onClick={goBack}
            className="text-neutral-500 transition-colors hover:text-nvidia"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={restart}
            className="text-neutral-500 transition-colors hover:text-nvidia"
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
}
