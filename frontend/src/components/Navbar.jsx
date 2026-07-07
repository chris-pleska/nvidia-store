import { useState } from "react";
import { Link } from "react-router-dom";
import BackendStatus from "./BackendStatus.jsx";
import GuidesDropdown from "./GuidesDropdown.jsx";

const GUIDE_LINKS = [
  { label: "Model Advisor", to: "/model-advisor" },
  { label: "Help Me Choose", to: "/help-me-choose" },
  { label: "Compare", to: "/compare" },
  { label: "Learn", to: "/learn" },
];

const NAV_LINK_CLASS =
  "whitespace-nowrap text-neutral-300 transition-colors hover:text-nvidia";

const CTA_CLASS =
  "whitespace-nowrap rounded-md bg-nvidia px-3 py-1.5 font-semibold text-neutral-950 transition-opacity hover:opacity-90";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="border-b border-neutral-800 bg-neutral-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="shrink-0 whitespace-nowrap text-base font-semibold text-nvidia sm:text-lg"
        >
          Chris's Silicon Supply Co.
        </Link>

        {/* Desktop nav */}
        <div className="hidden flex-1 items-center justify-between md:flex">
          <ul className="flex items-center gap-6">
            <li>
              <Link to="/" className={NAV_LINK_CLASS}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className={NAV_LINK_CLASS}>
                Shop
              </Link>
            </li>
            <li>
              <GuidesDropdown />
            </li>
            <li>
              <Link to="/request-quote" className={CTA_CLASS}>
                Request a Quote
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-4">
            <BackendStatus />
            <Link
              to="/requests"
              className="whitespace-nowrap text-sm text-neutral-500 transition-colors hover:text-neutral-300"
            >
              Requests
            </Link>
          </div>
        </div>

        {/* Mobile hamburger toggle */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex items-center justify-center rounded-md p-2 text-neutral-300 hover:text-nvidia md:hidden"
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="border-t border-neutral-800 px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-3">
            <li>
              <Link
                to="/"
                className={NAV_LINK_CLASS}
                onClick={() => setMobileOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/shop"
                className={NAV_LINK_CLASS}
                onClick={() => setMobileOpen(false)}
              >
                Shop
              </Link>
            </li>
            <li className="pt-1">
              <p className="text-xs uppercase tracking-wide text-neutral-500">
                Guides
              </p>
              <ul className="mt-2 flex flex-col gap-3 pl-2">
                {GUIDE_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={NAV_LINK_CLASS}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="pt-1">
              <Link
                to="/request-quote"
                className={`inline-block ${CTA_CLASS}`}
                onClick={() => setMobileOpen(false)}
              >
                Request a Quote
              </Link>
            </li>
            <li className="pt-1">
              <Link
                to="/requests"
                className="text-sm text-neutral-500 transition-colors hover:text-neutral-300"
                onClick={() => setMobileOpen(false)}
              >
                Requests
              </Link>
            </li>
            <li>
              <BackendStatus />
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
