import { Link } from "react-router-dom";
import BackendStatus from "./BackendStatus.jsx";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Model Advisor", to: "/model-advisor" },
  { label: "Help Me Choose", to: null },
  { label: "Requests", to: null },
];

export default function Navbar() {
  return (
    <nav className="border-b border-neutral-800 bg-neutral-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-semibold text-nvidia">
          Chris's Silicon Supply Co.
        </Link>
        <ul className="flex gap-6">
          {LINKS.map(({ label, to }) => (
            <li key={label}>
              {to ? (
                <Link
                  to={to}
                  className="text-neutral-300 transition-colors hover:text-nvidia"
                >
                  {label}
                </Link>
              ) : (
                <a
                  href="#"
                  className="text-neutral-300 transition-colors hover:text-nvidia"
                >
                  {label}
                </a>
              )}
            </li>
          ))}
        </ul>
        <BackendStatus />
      </div>
    </nav>
  );
}
