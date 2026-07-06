import { useLocation } from "react-router-dom";
import QuoteRequestForm from "../components/QuoteRequestForm.jsx";

const FALLBACK_BUILD = {
  description: "General inquiry — no specific build selected",
  totalPrice: 0,
};

export default function RequestQuote() {
  const location = useLocation();
  const build = location.state?.build ?? FALLBACK_BUILD;

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-3xl font-bold">
        Request a <span className="text-nvidia">Quote</span>
      </h1>
      <p className="mt-2 text-neutral-400">
        Add your name and contact info below and we'll follow up.
      </p>

      <div className="mt-8">
        <QuoteRequestForm build={build} />
      </div>
    </main>
  );
}
