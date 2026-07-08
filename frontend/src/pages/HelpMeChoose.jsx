import { useState } from "react";
import { Link } from "react-router-dom";
import SpecTerm from "../components/SpecTerm.jsx";
import { API_BASE_URL } from "../config.js";
import { formatPowerComparison } from "../utils/formatPowerComparison.js";
import renderJargon from "../utils/renderJargon.jsx";

const PATHS = [
  {
    key: "startup",
    title: "I'm a small startup",
    subtitle:
      "Cost-effective way to experiment with AI, no huge upfront spend.",
    endpoint: `${API_BASE_URL}/api/recommend/startup`,
  },
  {
    key: "midsize",
    title: "I'm a mid-size company",
    subtitle: "Serve real production workloads with room to grow.",
    endpoint: `${API_BASE_URL}/api/recommend/midsize`,
  },
  {
    key: "enterprise",
    title: "I'm a large company / enterprise",
    subtitle: "Datacenter-scale, frontier-model capacity, single system.",
    endpoint: `${API_BASE_URL}/api/recommend/enterprise`,
  },
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function HelpMeChoose() {
  const [selectedKey, setSelectedKey] = useState(null);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle");

  function handleSelect(path) {
    setSelectedKey(path.key);
    setStatus("loading");
    setResult(null);

    fetch(path.endpoint)
      .then((res) => {
        if (!res.ok) throw new Error("bad response");
        return res.json();
      })
      .then((data) => {
        setResult(data);
        setStatus("loaded");
      })
      .catch(() => setStatus("error"));
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold">
        Help Me <span className="text-nvidia">Choose</span>
      </h1>
      <p className="mt-2 text-neutral-400">
        Tell us where you're starting from, and we'll recommend a build.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PATHS.map((path) => (
          <button
            key={path.key}
            type="button"
            onClick={() => handleSelect(path)}
            className={`rounded-lg border p-5 text-left transition-colors ${
              selectedKey === path.key
                ? "border-nvidia bg-neutral-900"
                : "border-neutral-800 bg-neutral-900 hover:border-nvidia/50"
            }`}
          >
            <h2 className="text-lg font-semibold text-neutral-100">
              {path.title}
            </h2>
            <p className="mt-1 text-sm text-neutral-400">{path.subtitle}</p>
          </button>
        ))}
      </div>

      {status === "loading" && (
        <p className="mt-8 text-neutral-400">Finding a recommendation...</p>
      )}

      {status === "error" && (
        <p className="mt-8 text-red-400">
          Couldn't reach the backend. Is the Flask server running?
        </p>
      )}

      {status === "loaded" && result && (
        <div className="mt-8 rounded-lg border border-neutral-800 bg-neutral-900 p-6">
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            Recommended Build
          </p>
          <h3 className="mt-1 text-xl font-semibold text-neutral-100">
            {result.quantity ?? 1}x {result.product.name}
          </h3>

          <div className="mt-4 flex flex-wrap gap-6 text-sm text-neutral-400">
            <div>
              <span className="block text-neutral-500">Price per unit</span>
              <SpecTerm
                term="price"
                value={currencyFormatter.format(result.product.price_usd)}
              />
            </div>
            <div>
              <span className="block text-neutral-500">Power</span>
              <SpecTerm
                term="power"
                value={
                  result.product.power_watts != null
                    ? `${result.product.power_watts}W`
                    : "—"
                }
              />
              {result.product.power_context && (
                <p className="mt-0.5 text-xs leading-snug text-neutral-500">
                  {formatPowerComparison(result.product.power_context)}
                </p>
              )}
            </div>
            <div>
              <span className="block text-neutral-500">VRAM</span>
              <SpecTerm
                term="vram"
                value={
                  result.product.vram_gb != null
                    ? `${result.product.vram_gb}GB`
                    : "—"
                }
              />
            </div>
          </div>

          <p className="mt-4 text-sm text-neutral-400">{result.rationale}</p>

          {(result.good_for?.length > 0 || result.not_built_for?.length > 0) && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {result.good_for?.length > 0 && (
                <div className="rounded-md border border-nvidia/30 bg-nvidia/5 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-nvidia">
                    What this build is good at
                  </p>
                  <ul className="mt-2 flex flex-col gap-1.5 text-sm text-neutral-300">
                    {result.good_for.map((bullet) => (
                      <li key={bullet} className="flex gap-2">
                        <span className="text-nvidia">+</span>
                        <span>{renderJargon(bullet)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.not_built_for?.length > 0 && (
                <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-400">
                    What it's NOT built for
                  </p>
                  <ul className="mt-2 flex flex-col gap-1.5 text-sm text-neutral-300">
                    {result.not_built_for.map((bullet) => (
                      <li key={bullet} className="flex gap-2">
                        <span className="text-amber-400">−</span>
                        <span>{renderJargon(bullet)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <p className="mt-4 text-2xl font-bold text-nvidia">
            Total: {currencyFormatter.format(result.total_price)}
          </p>

          <Link
            to="/request-quote"
            state={{
              build: {
                description: `${result.quantity ?? 1}x ${result.product.name}`,
                totalPrice: result.total_price,
              },
            }}
            className="mt-4 inline-block rounded-md border border-nvidia/40 px-3 py-2 text-sm font-medium text-nvidia transition-colors hover:bg-nvidia/10"
          >
            Request this build
          </Link>
        </div>
      )}

      {status === "loaded" && result?.cluster_explainer && (
        <div className="mt-6 rounded-lg border border-neutral-800 bg-neutral-900 p-6">
          <h3 className="text-lg font-semibold text-neutral-100">
            What's a <span className="text-nvidia">cluster</span>?
          </h3>

          <div className="mt-4 flex flex-wrap gap-6 text-sm text-neutral-400">
            <div>
              <span className="block text-neutral-500">Combined VRAM</span>
              <SpecTerm term="vram" value={`${result.combined_vram_gb}GB`} />
            </div>
            <div>
              <span className="block text-neutral-500">Combined Power</span>
              <SpecTerm
                term="power"
                value={`${result.combined_power_watts}W`}
              />
              {result.combined_power_context && (
                <p className="mt-0.5 text-xs leading-snug text-neutral-500">
                  {formatPowerComparison(result.combined_power_context)}
                </p>
              )}
            </div>
            <div>
              <span className="block text-neutral-500">Total Price</span>
              <SpecTerm
                term="price"
                value={currencyFormatter.format(result.total_price)}
              />
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-neutral-300">
            {result.cluster_explainer.definition}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            {result.cluster_explainer.honest_contrast}{" "}
            <Link
              to="/learn#clusters"
              className="text-nvidia hover:underline"
            >
              Learn more about clusters
            </Link>
          </p>
        </div>
      )}
    </main>
  );
}
