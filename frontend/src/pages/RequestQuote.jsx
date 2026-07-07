import { useState } from "react";
import { useLocation } from "react-router-dom";
import QuoteRequestForm from "../components/QuoteRequestForm.jsx";
import { API_BASE_URL } from "../config.js";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatBuildDescription(recommendedProducts) {
  return recommendedProducts
    .map((item) => `${item.quantity}x ${item.name}`)
    .join(", ");
}

export default function RequestQuote() {
  const location = useLocation();
  const initialBuild = location.state?.build ?? null;

  const [build, setBuild] = useState(initialBuild);
  const [prompt, setPrompt] = useState("");
  const [aiStatus, setAiStatus] = useState("idle");
  const [aiResult, setAiResult] = useState(null);

  function handleGetRecommendation(event) {
    event.preventDefault();
    setAiStatus("loading");
    setAiResult(null);

    fetch(`${API_BASE_URL}/api/ai-recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("bad response");
        return res.json();
      })
      .then((data) => {
        setAiResult(data);
        setAiStatus("idle");
        setBuild({
          description: formatBuildDescription(data.recommended_products),
          totalPrice: data.total_price,
        });
      })
      .catch(() => {
        setAiStatus("error");
      });
  }

  function handleSubmitAnyway() {
    setBuild({
      description: `Custom request: ${prompt}`,
      totalPrice: 0,
    });
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-3xl font-bold">
        Request a <span className="text-nvidia">Quote</span>
      </h1>
      <p className="mt-2 text-neutral-400">
        Add your name and contact info below and we'll follow up.
      </p>

      {!build && (
        <form
          onSubmit={handleGetRecommendation}
          className="mt-8 rounded-lg border border-neutral-800 bg-neutral-900 p-6"
        >
          <label
            className="block text-sm font-medium text-neutral-300"
            htmlFor="ai-prompt"
          >
            Tell us what you're trying to do
          </label>
          <textarea
            id="ai-prompt"
            required
            rows={4}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder={
              'e.g. "I want to run DeepSeek V4 Flash for my startup" or ' +
              '"I need a machine for AI video editing"'
            }
            className="mt-2 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 focus:border-nvidia focus:outline-none"
          />

          <button
            type="submit"
            disabled={aiStatus === "loading"}
            className="mt-4 w-full rounded-md bg-nvidia px-4 py-2 font-semibold text-neutral-950 transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {aiStatus === "loading"
              ? "Putting together your build..."
              : "Get my recommended build"}
          </button>

          {aiStatus === "error" && (
            <div className="mt-4 rounded-md border border-amber-500/40 bg-amber-500/10 p-3">
              <p className="text-sm text-amber-400">
                We couldn't generate a build automatically — submit anyway
                and we'll get back to you.
              </p>
              <button
                type="button"
                onClick={handleSubmitAnyway}
                className="mt-2 text-sm font-medium text-nvidia hover:underline"
              >
                Submit anyway
              </button>
            </div>
          )}
        </form>
      )}

      {build && (
        <div className="mt-8">
          {aiResult && (
            <div className="mb-6 rounded-lg border border-neutral-800 bg-neutral-900 p-6">
              <p className="text-xs uppercase tracking-wide text-neutral-500">
                Recommended Build
              </p>
              <ul className="mt-2 flex flex-col gap-1">
                {aiResult.recommended_products.map((item) => (
                  <li key={item.name} className="text-sm text-neutral-100">
                    {item.quantity}x {item.name} —{" "}
                    {currencyFormatter.format(item.subtotal)}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-neutral-400">
                {aiResult.reasoning}
              </p>
              <p className="mt-3 text-lg font-bold text-nvidia">
                Total: {currencyFormatter.format(aiResult.total_price)}
              </p>
            </div>
          )}

          <QuoteRequestForm build={build} />
        </div>
      )}
    </main>
  );
}
