import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const GUIDE_LINKS = [
  { label: "Model Advisor", to: "/model-advisor" },
  { label: "Help Me Choose", to: "/help-me-choose" },
  { label: "Compare", to: "/compare" },
  { label: "Learn", to: "/learn" },
];

export default function GuidesDropdown() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  function openNow() {
    clearTimeout(closeTimeoutRef.current);
    setOpen(true);
  }

  function closeSoon() {
    closeTimeoutRef.current = setTimeout(() => setOpen(false), 120);
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      setOpen(false);
      containerRef.current?.querySelector("button")?.focus();
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 whitespace-nowrap text-neutral-300 transition-colors hover:text-nvidia"
      >
        Guides
        <svg
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="menu"
          className="absolute left-0 top-full z-20 mt-2 w-48 whitespace-nowrap rounded-md border border-neutral-800 bg-neutral-900 py-1 shadow-lg shadow-black/40"
        >
          {GUIDE_LINKS.map((link) => (
            <li key={link.to} role="none">
              <Link
                to={link.to}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-nvidia"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
