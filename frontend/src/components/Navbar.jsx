import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import BackendStatus from "./BackendStatus.jsx";
import GuidesDropdown from "./GuidesDropdown.jsx";
import BagIcon from "./icons/BagIcon.jsx";
import LogoMark from "./icons/LogoMark.jsx";

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

function BagBadge({ count }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-2 -top-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-nvidia px-1 text-[10px] font-bold text-neutral-950">
      {count}
    </span>
  );
}

function NavbarLogo({ onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="group flex min-w-0 items-center gap-2 text-base font-semibold text-nvidia sm:text-lg"
    >
      <LogoMark size={30} className="logo-mark-spin shrink-0" />
      <span className="truncate">Chris's Silicon Supply Co.</span>
    </Link>
  );
}

function BagLink({ size = 24, onClick, totalUnits, bagLabel, className = "" }) {
  return (
    <Link
      to="/bag"
      onClick={onClick}
      aria-label={bagLabel}
      className={`relative flex shrink-0 items-center text-neutral-300 transition-colors hover:text-nvidia ${className}`}
    >
      <BagIcon size={size} />
      <BagBadge count={totalUnits} />
    </Link>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalUnits } = useCart();
  const bagLabel = `View bag${totalUnits > 0 ? ` (${totalUnits} item${totalUnits === 1 ? "" : "s"})` : ""}`;

  return (
    <nav className="border-b border-neutral-800 bg-neutral-950">
      <div className="mx-auto max-w-6xl px-6 py-4">
        {/* Desktop: three-zone grid — center nav is genuinely centered in
            the bar since the two flanking columns share equal (1fr) space,
            regardless of how wide the logo or action cluster are. */}
        <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4">
          <div className="justify-self-start">
            <NavbarLogo />
          </div>

          <ul className="flex items-center justify-self-center gap-8">
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
          </ul>

          <div className="flex items-center justify-self-end gap-4">
            <BackendStatus />
            <Link to="/request-quote" className={CTA_CLASS}>
              Request a Quote
            </Link>
            <BagLink totalUnits={totalUnits} bagLabel={bagLabel} />
            <Link
              to="/requests"
              className="whitespace-nowrap text-sm text-neutral-500 transition-colors hover:text-neutral-300"
            >
              Requests
            </Link>
          </div>
        </div>

        {/* Mobile row: logo, bag icon, hamburger */}
        <div className="flex items-center justify-between gap-4 md:hidden">
          <NavbarLogo onClick={() => setMobileOpen(false)} />

          <div className="flex items-center gap-1">
            <BagLink
              size={22}
              totalUnits={totalUnits}
              bagLabel={bagLabel}
              onClick={() => setMobileOpen(false)}
              className="p-2"
            />

            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((prev) => !prev)}
              className="flex items-center justify-center rounded-md p-2 text-neutral-300 hover:text-nvidia"
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
        </div>
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
                to="/bag"
                className={NAV_LINK_CLASS}
                onClick={() => setMobileOpen(false)}
              >
                Bag{totalUnits > 0 ? ` (${totalUnits})` : ""}
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
