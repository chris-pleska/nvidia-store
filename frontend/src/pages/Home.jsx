import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CategoryIcon from "../components/CategoryIcon.jsx";
import { API_BASE_URL } from "../config.js";
import { slugifyCategory } from "../utils/slugifyCategory.js";

const CATEGORIES = [
  "Desktop GPU",
  "Laptop GPU",
  "Professional GPU",
  "Datacenter GPU",
  "Server",
  "Rack System",
];

export default function Home() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/products`).then((res) => res.json()),
      fetch(`${API_BASE_URL}/api/models`).then((res) => res.json()),
    ])
      .then(([products, models]) => {
        const categoryCount = new Set(products.map((p) => p.category)).size;
        setStats({
          productCount: products.length,
          categoryCount,
          modelCount: models.length,
        });
      })
      .catch(() => setStats(null));
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_50%_0%,rgba(118,185,0,0.14),transparent_60%)]">
        <main className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <h1 className="text-4xl font-bold">
            Welcome to{" "}
            <span className="text-nvidia">Chris's Silicon Supply Co.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-neutral-400">
            We sell real NVIDIA hardware, from single consumer GPUs to full
            datacenter racks. If you're not sure what you need, we'll help
            you figure out the right hardware to run specific open-source AI
            models, with guided recommendations built for startups and
            mid-size companies alike.
          </p>
        </main>
      </section>

      <section className="border-t border-neutral-800 px-6 py-10">
        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-nvidia">
              {stats ? stats.productCount : "—"}
            </p>
            <p className="mt-1 text-sm text-neutral-500">Products in Stock</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-nvidia">
              {stats ? stats.categoryCount : "—"}
            </p>
            <p className="mt-1 text-sm text-neutral-500">Categories</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-nvidia">
              {stats ? stats.modelCount : "—"}
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              Open-Source Models Covered
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-800 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-xl font-semibold text-neutral-100">
            Shop by <span className="text-nvidia">Category</span>
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                to={`/shop#${slugifyCategory(category)}`}
                className="flex flex-col items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 p-4 text-center transition-colors hover:border-nvidia/50"
              >
                <span className="text-nvidia">
                  <CategoryIcon category={category} size={32} />
                </span>
                <span className="text-xs text-neutral-400">{category}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
