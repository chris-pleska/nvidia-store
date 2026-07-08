import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EstimateBadge from "../components/EstimateBadge.jsx";
import SpecTerm from "../components/SpecTerm.jsx";
import { useCart } from "../context/CartContext.jsx";
import { API_BASE_URL } from "../config.js";
import { formatPowerComparison } from "../utils/formatPowerComparison.js";
import { humanizePower } from "../utils/humanizePower.js";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function Bag() {
  const { items, incrementItem, decrementItem, removeItem, totalUnits } =
    useCart();
  const navigate = useNavigate();
  const [clusterExplainer, setClusterExplainer] = useState(null);

  useEffect(() => {
    if (totalUnits < 2) return;
    fetch(`${API_BASE_URL}/api/cluster-explainer`)
      .then((res) => res.json())
      .then(setClusterExplainer)
      .catch(() => setClusterExplainer(null));
  }, [totalUnits]);

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-3xl font-bold">
          Your <span className="text-nvidia">Bag</span>
        </h1>
        <p className="mt-4 text-neutral-400">
          Your bag is empty. Browse the shop to add some hardware.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-block rounded-md bg-nvidia px-5 py-2.5 font-semibold text-neutral-950 transition-opacity hover:opacity-90"
        >
          Browse the Shop
        </Link>
      </main>
    );
  }

  const totalPrice = items.reduce(
    (sum, item) => sum + Number(item.product.price_usd) * item.quantity,
    0,
  );
  const totalPowerWatts = items.reduce(
    (sum, item) => sum + (item.product.power_watts ?? 0) * item.quantity,
    0,
  );
  const totalVramGb = items.reduce(
    (sum, item) => sum + (item.product.vram_gb ?? 0) * item.quantity,
    0,
  );
  const anyPowerEstimate = items.some((item) => item.product.power_is_estimate);
  const powerContext =
    totalPowerWatts > 0 ? humanizePower(totalPowerWatts) : null;

  function handleRequestQuote() {
    const description = items
      .map((item) => `${item.quantity}x ${item.product.name}`)
      .join(", ");
    navigate("/request-quote", {
      state: { build: { description, totalPrice } },
    });
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">
        Your <span className="text-nvidia">Bag</span>
      </h1>

      <div className="mt-8 flex flex-col gap-4">
        {items.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-neutral-800 bg-neutral-900 p-4"
          >
            <div className="min-w-[180px] flex-1">
              <p className="font-medium text-neutral-100">{product.name}</p>
              <p className="mt-1 flex items-center text-sm text-neutral-400">
                {currencyFormatter.format(product.price_usd)} / unit
                {product.price_is_estimate && <EstimateBadge />}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => decrementItem(product.id)}
                disabled={quantity <= 1}
                aria-label={`Decrease quantity of ${product.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-700 text-neutral-300 transition-colors hover:border-nvidia/50 hover:text-nvidia disabled:cursor-not-allowed disabled:opacity-40"
              >
                −
              </button>
              <span className="w-6 text-center text-neutral-100">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => incrementItem(product.id)}
                aria-label={`Increase quantity of ${product.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-700 text-neutral-300 transition-colors hover:border-nvidia/50 hover:text-nvidia"
              >
                +
              </button>
            </div>

            <p className="w-24 text-right font-semibold text-nvidia">
              {currencyFormatter.format(Number(product.price_usd) * quantity)}
            </p>

            <button
              type="button"
              onClick={() => removeItem(product.id)}
              className="text-sm text-neutral-500 transition-colors hover:text-red-400"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {totalUnits >= 2 && clusterExplainer && (
        <div className="mt-6 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
          <p className="text-sm text-neutral-300">
            {clusterExplainer.definition}
          </p>
          <Link
            to="/learn#clusters"
            className="mt-1 inline-block text-xs text-nvidia hover:underline"
          >
            What's a cluster?
          </Link>
        </div>
      )}

      <div className="mt-8 rounded-lg border border-neutral-800 bg-neutral-900 p-6">
        <div className="flex flex-wrap gap-6 text-sm text-neutral-400">
          <div>
            <span className="block text-neutral-500">Combined Power</span>
            <span className="inline-flex items-center">
              <SpecTerm term="power" value={`${totalPowerWatts}W`} />
              {anyPowerEstimate && <EstimateBadge />}
            </span>
            {powerContext && (
              <p className="mt-0.5 text-xs leading-snug text-neutral-500">
                {formatPowerComparison(powerContext)}
              </p>
            )}
          </div>
          <div>
            <span className="block text-neutral-500">Combined VRAM</span>
            <SpecTerm term="vram" value={`${totalVramGb}GB`} />
          </div>
        </div>

        <p className="mt-4 text-2xl font-bold text-nvidia">
          Total: {currencyFormatter.format(totalPrice)}
        </p>

        <button
          type="button"
          onClick={handleRequestQuote}
          className="mt-4 w-full rounded-md bg-nvidia px-4 py-2 font-semibold text-neutral-950 transition-opacity hover:opacity-90 sm:w-auto"
        >
          Request a Quote for this Bag
        </button>
      </div>
    </main>
  );
}
