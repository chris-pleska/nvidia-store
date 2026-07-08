import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import CategoryIcon from "./CategoryIcon.jsx";
import EstimateBadge from "./EstimateBadge.jsx";
import SpecTerm from "./SpecTerm.jsx";
import { formatPowerComparison } from "../utils/formatPowerComparison.js";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function ProductCard({ product }) {
  const {
    name,
    category,
    price_usd,
    power_watts,
    power_context,
    vram_gb,
    description,
    source_note,
    price_is_estimate,
    power_is_estimate,
  } = product;

  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const flashTimeoutRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(flashTimeoutRef.current);
  }, []);

  function handleAddToBag() {
    addItem(product);
    setJustAdded(true);
    clearTimeout(flashTimeoutRef.current);
    flashTimeoutRef.current = setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <div className="flex flex-col rounded-lg border border-neutral-800 bg-neutral-900 p-5 transition-colors hover:border-nvidia/50">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-neutral-100">{name}</h3>
        <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-nvidia/40 bg-nvidia/10 px-2 py-1 text-xs font-medium text-nvidia">
          <CategoryIcon category={category} size={14} />
          <SpecTerm term="category" value={category} />
        </span>
      </div>

      <p className="mt-2 flex items-center text-2xl font-bold text-nvidia">
        <SpecTerm term="price" value={currencyFormatter.format(price_usd)} />
        {price_is_estimate && <EstimateBadge />}
      </p>

      <div className="mt-3 flex gap-6 text-sm text-neutral-400">
        <div>
          <span className="block text-neutral-500">Power</span>
          <span className="inline-flex items-center">
            <SpecTerm
              term="power"
              value={power_watts != null ? `${power_watts}W` : "—"}
            />
            {power_is_estimate && <EstimateBadge />}
          </span>
          {power_context && (
            <p className="mt-0.5 text-xs leading-snug text-neutral-500">
              {formatPowerComparison(power_context)}
            </p>
          )}
        </div>
        <div>
          <span className="block text-neutral-500">VRAM</span>
          <SpecTerm
            term="vram"
            value={vram_gb != null ? `${vram_gb}GB` : "—"}
          />
        </div>
      </div>

      <p className="mt-4 text-sm text-neutral-400">{description}</p>

      {category === "Rack System" && (
        <Link
          to="/learn#clusters"
          className="mt-2 inline-block text-xs text-nvidia hover:underline"
        >
          What's a cluster?
        </Link>
      )}

      <button
        type="button"
        onClick={handleAddToBag}
        className={`mt-4 rounded-md px-4 py-2 font-semibold transition-colors ${
          justAdded
            ? "bg-nvidia/70 text-neutral-950"
            : "bg-nvidia text-neutral-950 hover:opacity-90"
        }`}
      >
        {justAdded ? "✓ Added to Bag" : "Add to Bag"}
      </button>

      {source_note && (
        <p className="mt-3 border-t border-neutral-800 pt-3 text-xs text-neutral-500">
          {source_note}
        </p>
      )}
    </div>
  );
}
