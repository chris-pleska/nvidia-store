import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CategoryIcon from "../components/CategoryIcon.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { API_BASE_URL } from "../config.js";
import { slugifyCategory } from "../utils/slugifyCategory.js";

const PRODUCTS_URL = `${API_BASE_URL}/api/products`;

const CATEGORIES = [
  "Desktop GPU",
  "Laptop GPU",
  "Professional GPU",
  "Datacenter GPU",
  "Server",
  "Rack System",
];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [sortDirection, setSortDirection] = useState("asc");
  const location = useLocation();

  useEffect(() => {
    fetch(PRODUCTS_URL)
      .then((res) => {
        if (!res.ok) throw new Error("bad response");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setStatus("loaded");
      })
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    if (status !== "loaded" || !location.hash) return;

    const target = document.getElementById(location.hash.slice(1));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [status, location.hash]);

  function sortByPrice(items) {
    return [...items].sort((a, b) =>
      sortDirection === "asc"
        ? a.price_usd - b.price_usd
        : b.price_usd - a.price_usd,
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">
        Shop <span className="text-nvidia">Silicon</span>
      </h1>

      {status === "loading" && (
        <p className="mt-6 text-neutral-400">Loading products...</p>
      )}

      {status === "error" && (
        <p className="mt-6 text-red-400">
          Couldn't reach the backend. Is the Flask server running?
        </p>
      )}

      {status === "loaded" && products.length === 0 && (
        <p className="mt-6 text-neutral-400">No products available yet.</p>
      )}

      {status === "loaded" && products.length > 0 && (
        <>
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() =>
                setSortDirection((current) =>
                  current === "asc" ? "desc" : "asc",
                )
              }
              className="inline-flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-300 transition-colors hover:border-nvidia/50"
            >
              Sort by price:{" "}
              <span className="font-medium text-nvidia">
                {sortDirection === "asc" ? "Low to High" : "High to Low"}
              </span>
              <span className="text-nvidia">
                {sortDirection === "asc" ? "↑" : "↓"}
              </span>
            </button>
          </div>

          {CATEGORIES.map((category) => {
            const categoryProducts = products.filter(
              (product) => product.category === category,
            );

            if (categoryProducts.length === 0) return null;

            return (
              <section
                key={category}
                id={slugifyCategory(category)}
                className="mt-10 scroll-mt-24"
              >
                <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
                  <span className="text-nvidia">
                    <CategoryIcon category={category} size={24} />
                  </span>
                  <h2 className="text-lg font-semibold text-neutral-100">
                    {category}
                  </h2>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {sortByPrice(categoryProducts).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            );
          })}

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 left-6 z-40 rounded-full border border-neutral-800 bg-neutral-900 px-4 py-2 text-xs text-neutral-300 shadow-lg transition-colors hover:border-nvidia/50 hover:text-nvidia"
          >
            ↑ Back to top
          </button>
        </>
      )}
    </main>
  );
}
