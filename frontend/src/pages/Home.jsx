import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CategoryIcon from "../components/CategoryIcon.jsx";
import { HELP_ME_CHOOSE_PATHS } from "../data/helpMeChoosePaths.js";
import { API_BASE_URL } from "../config.js";
import { slugifyCategory } from "../utils/slugifyCategory.js";

const CHOOSE_YOUR_SIDE_ID = "choose-your-side";

function scrollToChooseYourSide(event) {
  event.preventDefault();
  document
    .getElementById(CHOOSE_YOUR_SIDE_ID)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

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
            From gaming rig to{" "}
            <span className="text-nvidia">AI datacenter</span> — we'll help
            you find yours.
          </h1>
          <p className="mt-4 max-w-2xl text-neutral-400">
            Real NVIDIA hardware at every scale — with the specs translated
            into plain English, the memory math done in the open, and
            honest advice on what to buy. Not sure where you land?{" "}
            <a
              href={`#${CHOOSE_YOUR_SIDE_ID}`}
              onClick={scrollToChooseYourSide}
              className="text-nvidia hover:underline"
            >
              We'll help you choose
            </a>
            .
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

      <section
        id={CHOOSE_YOUR_SIDE_ID}
        className="scroll-mt-24 border-t border-neutral-800 px-6 py-10"
      >
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-xl font-semibold text-neutral-100">
            Find <span className="text-nvidia">Your Build</span>
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-400">
            Tell us where you're starting from, and we'll recommend a build.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {HELP_ME_CHOOSE_PATHS.map((path) => (
              <Link
                key={path.key}
                to={`/help-me-choose?path=${path.key}`}
                className="rounded-lg border border-neutral-800 bg-neutral-900 p-5 text-left transition-all hover:-translate-y-0.5 hover:border-nvidia/50 hover:shadow-lg hover:shadow-nvidia/10"
              >
                <h3 className="text-lg font-semibold text-neutral-100">
                  {path.title}
                </h3>
                <p className="mt-1 text-sm text-neutral-400">
                  {path.subtitle}
                </p>
              </Link>
            ))}
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
