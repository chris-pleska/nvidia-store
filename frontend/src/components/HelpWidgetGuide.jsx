import { useState } from "react";
import { Link } from "react-router-dom";

const STEPS = {
  start: {
    type: "question",
    greeting: "Hi! Not sure what you need? Let's figure it out.",
    question: "What are you looking for?",
    options: [
      { label: "I just want a GPU for my computer", next: "gpu" },
      { label: "I want to run a specific AI model", next: "model" },
      { label: "I'm setting up for a business", next: "business" },
      { label: "I'm just browsing", next: "browsing" },
    ],
  },
  gpu: {
    type: "answer",
    text: "Check out our Desktop and Laptop GPUs.",
    cta: { label: "Browse the Shop", to: "/shop" },
  },
  model: {
    type: "answer",
    text: "Our Model Advisor shows exactly what hardware you need for popular open-source models.",
    cta: { label: "Go to Model Advisor", to: "/model-advisor" },
  },
  business: {
    type: "question",
    question: "Small startup or bigger company?",
    options: [
      { label: "Small startup", next: "business-startup" },
      { label: "Bigger company", next: "business-midsize" },
    ],
  },
  "business-startup": {
    type: "answer",
    text: "Startups usually just need one solid GPU to get started, without a big upfront investment.",
    cta: { label: "Help Me Choose", to: "/help-me-choose" },
  },
  "business-midsize": {
    type: "answer",
    text: "Bigger companies usually need multiple GPUs working together to handle real production workloads.",
    cta: { label: "Help Me Choose", to: "/help-me-choose" },
  },
  browsing: {
    type: "answer",
    text: "No worries! Take a look around.",
    cta: { label: "Browse the Shop", to: "/shop" },
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
          <Link
            to={step.cta.to}
            onClick={onNavigate}
            className="rounded-md bg-nvidia px-3 py-2 text-center text-sm font-semibold text-neutral-950 transition-opacity hover:opacity-90"
          >
            {step.cta.label}
          </Link>
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
