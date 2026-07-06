import SpecTerm from "./SpecTerm.jsx";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function ModelCard({ model }) {
  const {
    name,
    developer_lab,
    license,
    param_count_billions,
    required_memory_gb,
    recommended_product,
    source_note,
  } = model;

  return (
    <div className="flex flex-col rounded-lg border border-neutral-800 bg-neutral-900 p-5 transition-colors hover:border-nvidia/50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-neutral-100">{name}</h3>
          <p className="text-sm text-neutral-500">{developer_lab}</p>
        </div>
        <span className="whitespace-nowrap rounded-full border border-nvidia/40 bg-nvidia/10 px-2 py-1 text-xs font-medium text-nvidia">
          <SpecTerm term="license" value={license} />
        </span>
      </div>

      <div className="mt-4 flex gap-6 text-sm text-neutral-400">
        <div>
          <span className="block text-neutral-500">Parameters</span>
          <SpecTerm
            term="parameters"
            value={param_count_billions != null ? `${param_count_billions}B` : "—"}
          />
        </div>
        <div>
          <span className="block text-neutral-500">Required Memory</span>
          <SpecTerm
            term="vram"
            value={
              required_memory_gb != null ? `${required_memory_gb}GB` : "—"
            }
          />
          {param_count_billions != null && required_memory_gb != null && (
            <p className="mt-0.5 text-xs leading-snug text-neutral-500">
              {param_count_billions}B parameters × 1GB × 1.2 (20% buffer) ={" "}
              {required_memory_gb}GB needed
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-md border border-neutral-800 bg-neutral-950 p-3">
        <p className="text-xs uppercase tracking-wide text-neutral-500">
          Recommended Build
        </p>
        {recommended_product ? (
          <>
            <p className="mt-1 text-base font-semibold text-nvidia">
              {recommended_product.units_needed}x{" "}
              {recommended_product.product_name} ={" "}
              {currencyFormatter.format(recommended_product.total_price)}
            </p>
            {required_memory_gb != null && (
              <p className="mt-1 text-xs leading-snug text-neutral-500">
                {required_memory_gb}GB ÷ {recommended_product.vram_gb_per_unit}
                GB per {recommended_product.product_name} ={" "}
                {(
                  required_memory_gb / recommended_product.vram_gb_per_unit
                ).toFixed(2)}{" "}
                → rounded up to {recommended_product.units_needed} GPUs
              </p>
            )}
          </>
        ) : (
          <p className="mt-1 text-sm text-neutral-400">
            No recommended build available.
          </p>
        )}
      </div>

      {source_note && (
        <p className="mt-3 border-t border-neutral-800 pt-3 text-xs text-neutral-500">
          {source_note}
        </p>
      )}
    </div>
  );
}
