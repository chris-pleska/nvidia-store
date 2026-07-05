import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { API_BASE_URL } from "../config.js";

const PRODUCTS_URL = `${API_BASE_URL}/api/products`;

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");

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
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
