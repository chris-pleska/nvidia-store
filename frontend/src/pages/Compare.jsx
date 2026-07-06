import { useEffect, useState } from "react";
import EstimateBadge from "../components/EstimateBadge.jsx";
import { API_BASE_URL } from "../config.js";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function productToItem(product) {
  return {
    key: `product-${product.id}`,
    checkboxLabel: `${product.name} — ${currencyFormatter.format(product.price_usd)}`,
    itemLabel: product.name,
    price: product.price_usd,
    priceIsEstimate: product.price_is_estimate,
    gpuMemoryGb: product.vram_gb,
    powerWatts: product.power_watts,
    powerIsEstimate: product.power_is_estimate,
    homesEquivalent: product.power_context?.homes_equivalent ?? null,
    machineLabel: "Single machine",
  };
}

function modelToBuildItem(model) {
  const rec = model.recommended_product;
  if (!rec) return null;

  return {
    key: `build-${model.id}`,
    checkboxLabel: `Minimum build for ${model.name}`,
    itemLabel: `${rec.units_needed}x ${rec.product_name}`,
    price: rec.total_price,
    priceIsEstimate: rec.price_is_estimate,
    gpuMemoryGb: rec.combined_vram_gb,
    powerWatts: rec.combined_power_watts,
    powerIsEstimate: rec.power_is_estimate,
    homesEquivalent: rec.combined_power_context?.homes_equivalent ?? null,
    machineLabel:
      rec.units_needed === 1 ? "Single machine" : `Cluster of ${rec.units_needed}`,
  };
}

export default function Compare() {
  const [productItems, setProductItems] = useState([]);
  const [buildItems, setBuildItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [comparedKeys, setComparedKeys] = useState(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/products`).then((res) => res.json()),
      fetch(`${API_BASE_URL}/api/models`).then((res) => res.json()),
    ])
      .then(([products, models]) => {
        setProductItems(products.map(productToItem));
        setBuildItems(models.map(modelToBuildItem).filter(Boolean));
        setStatus("loaded");
      })
      .catch(() => setStatus("error"));
  }, []);

  const allItems = [...productItems, ...buildItems];
  const itemsByKey = new Map(allItems.map((item) => [item.key, item]));

  function toggleKey(key) {
    setSelectedKeys((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  function handleCompare() {
    if (selectedKeys.size < 2) {
      setShowHint(true);
      setComparedKeys(null);
      return;
    }
    setShowHint(false);
    setComparedKeys(new Set(selectedKeys));
  }

  const comparedItems = comparedKeys
    ? allItems.filter((item) => comparedKeys.has(item.key))
    : [];

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold">
        Compare <span className="text-nvidia">Hardware</span>
      </h1>
      <p className="mt-2 text-neutral-400">
        Pick two or more items — individual products or recommended minimum
        builds — to compare side by side.
      </p>

      {status === "loading" && (
        <p className="mt-6 text-neutral-400">Loading catalog...</p>
      )}

      {status === "error" && (
        <p className="mt-6 text-red-400">
          Couldn't reach the backend. Is the Flask server running?
        </p>
      )}

      {status === "loaded" && (
        <>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                Individual Products
              </h2>
              <div className="mt-3 flex flex-col gap-2">
                {productItems.map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center gap-2 text-sm text-neutral-300"
                  >
                    <input
                      type="checkbox"
                      checked={selectedKeys.has(item.key)}
                      onChange={() => toggleKey(item.key)}
                      className="accent-nvidia"
                    />
                    {item.checkboxLabel}
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                Recommended Minimum Builds
              </h2>
              <div className="mt-3 flex flex-col gap-2">
                {buildItems.map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center gap-2 text-sm text-neutral-300"
                  >
                    <input
                      type="checkbox"
                      checked={selectedKeys.has(item.key)}
                      onChange={() => toggleKey(item.key)}
                      className="accent-nvidia"
                    />
                    {item.checkboxLabel}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCompare}
            className="mt-6 rounded-md bg-nvidia px-5 py-2.5 font-semibold text-neutral-950 transition-opacity hover:opacity-90"
          >
            Compare selected
          </button>

          {showHint && (
            <p className="mt-3 text-sm text-amber-400">
              Select at least 2 items to compare.
            </p>
          )}

          {comparedKeys && comparedItems.length > 0 && (
            <div className="mt-8 overflow-x-auto rounded-lg border border-neutral-800">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-900 text-neutral-500">
                    <th className="px-4 py-3 font-medium">Item</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">GPU Memory</th>
                    <th className="px-4 py-3 font-medium">Power Draw</th>
                    <th className="px-4 py-3 font-medium">In Everyday Terms</th>
                    <th className="px-4 py-3 font-medium">
                      Single Machine or Cluster?
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparedItems.map((item) => (
                    <tr
                      key={item.key}
                      className="border-b border-neutral-800 bg-neutral-900/50 last:border-b-0"
                    >
                      <td className="px-4 py-3 font-medium text-neutral-100">
                        {item.itemLabel}
                      </td>
                      <td className="px-4 py-3 text-neutral-100">
                        {currencyFormatter.format(item.price)}
                        {item.priceIsEstimate && <EstimateBadge />}
                      </td>
                      <td className="px-4 py-3 text-neutral-400">
                        {item.gpuMemoryGb != null ? `${item.gpuMemoryGb}GB` : "—"}
                      </td>
                      <td className="px-4 py-3 text-neutral-400">
                        {item.powerWatts != null ? `${item.powerWatts}W` : "—"}
                        {item.powerIsEstimate && <EstimateBadge />}
                      </td>
                      <td className="px-4 py-3 text-neutral-400">
                        {item.homesEquivalent != null
                          ? `~${item.homesEquivalent} average homes`
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-neutral-400">
                        {item.machineLabel}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </main>
  );
}
