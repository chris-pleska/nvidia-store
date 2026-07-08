import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const SPEC_INFO = {
  price: {
    label: "Price",
    short:
      "The listed price in US dollars for this exact configuration.",
    deep:
      "Enterprise systems are often quoted case-by-case with support contracts, warranties, and volume discounts — treat this number as a starting point for budgeting, not a final invoice.",
  },
  power: {
    label: "Power (Watts)",
    short:
      "This is how much electricity the card draws under full load — higher means more heat and a bigger power supply needed.",
    deep:
      "Matters most when stacking multiple GPUs — your outlet and PSU need to handle the combined draw, not just one card's rating.",
  },
  vram: {
    label: "VRAM / Memory",
    short:
      "The amount of dedicated memory available for storing model weights, textures, or datasets while running.",
    deep:
      "Running out of VRAM means a model or scene won't fit at all, or has to be split across GPUs — this number is usually the hard ceiling on what you can run locally, more so than raw compute speed.",
  },
  category: {
    label: "Category",
    short:
      "Where this product sits in NVIDIA's lineup, from single-desktop cards to rack-scale systems.",
    deep:
      "Category roughly predicts the support model, cooling requirements, and how the product is bought — desktop cards ship retail, while server and rack systems are typically quoted and installed by a vendor.",
  },
  parameters: {
    label: "Parameters",
    short:
      "The number of adjustable values in the model — roughly, how \"big\" or capable it is.",
    deep:
      "More parameters generally means better capability, but also more memory and compute needed to run it — that's exactly what the required memory calculation below is based on.",
  },
  license: {
    label: "License",
    short:
      "A permissive open-source license — you can download, run, and modify this model freely.",
    deep:
      "MIT is one of the most permissive licenses in use — unlike some other open licenses, it doesn't require you to share your changes back or restrict commercial use.",
  },
  inference: {
    label: "Inference",
    short:
      "Running an already-trained model to get an answer — as opposed to training it. This is what happens every time you send a message to a chatbot.",
    deep:
      "Inference is far cheaper than training, but still needs enough VRAM to hold the whole model at once — that's the number this page is built around.",
  },
  finetuning: {
    label: "Fine-Tuning",
    short:
      "Taking an existing trained model and further training it on your own data, instead of training a model from scratch.",
    deep:
      "Fine-tuning needs meaningfully more memory and compute than just running (inference) the same model, since it also has to store gradients and optimizer state alongside the weights.",
  },
  "unified-memory": {
    label: "Unified Memory",
    short:
      "Many GPUs wired together (via NVLink) so they share one large memory pool instead of each being limited to its own.",
    deep:
      "This is what lets a rack like the GB200 NVL72 run a single model far larger than any individual GPU's memory — the combined pool, not any one chip, is the real ceiling.",
  },
  "liquid-cooling": {
    label: "Liquid Cooling",
    short:
      "Coolant piped directly to the chips instead of fans blowing air — needed when a system generates more heat than air can carry away.",
    deep:
      "Dense racks like the GB200 NVL72 can dissipate as much heat as dozens of space heaters running at once — only manageable with liquid cooling and real data center infrastructure.",
  },
};

const EDGE_MARGIN = 12;
const ARROW_INSET = 16;
const ARROW_SIZE = 12;

export default function SpecTerm({ term, value }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [coords, setCoords] = useState(null);
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);

  const info = SPEC_INFO[term];
  const showTooltip = hovered || expanded;

  useLayoutEffect(() => {
    if (!expanded) return;

    function handleOutsideClick(event) {
      const clickedContainer = containerRef.current?.contains(event.target);
      const clickedTooltip = tooltipRef.current?.contains(event.target);
      if (!clickedContainer && !clickedTooltip) {
        setExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [expanded]);

  useLayoutEffect(() => {
    if (!showTooltip) {
      setCoords(null);
      return;
    }

    function reposition() {
      const container = containerRef.current;
      const tooltip = tooltipRef.current;
      if (!container || !tooltip) return;

      const containerRect = container.getBoundingClientRect();
      const tooltipWidth = tooltip.offsetWidth;
      const tooltipHeight = tooltip.offsetHeight;

      const triggerCenterX = containerRect.left + containerRect.width / 2;
      const naturalLeft = triggerCenterX - tooltipWidth / 2;

      const minLeft = EDGE_MARGIN;
      const maxLeft = window.innerWidth - tooltipWidth - EDGE_MARGIN;
      const left = Math.min(Math.max(naturalLeft, minLeft), maxLeft);
      const top = containerRect.top - tooltipHeight - ARROW_SIZE / 2 - 6;

      const arrowLeft = Math.min(
        Math.max(triggerCenterX - left, ARROW_INSET),
        Math.max(tooltipWidth - ARROW_INSET, ARROW_INSET),
      );

      setCoords({ top, left, arrowLeft });
    }

    reposition();
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [showTooltip]);

  if (!info) {
    return <span>{value}</span>;
  }

  return (
    <span
      ref={containerRef}
      className="inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="cursor-help border-b border-dotted border-neutral-500 text-inherit hover:border-nvidia hover:text-nvidia focus:outline-none"
      >
        {value}
      </button>

      {showTooltip &&
        createPortal(
          <div
            ref={tooltipRef}
            style={{
              position: "fixed",
              top: coords ? `${coords.top}px` : "-9999px",
              left: coords ? `${coords.left}px` : "-9999px",
              visibility: coords ? "visible" : "hidden",
            }}
            className="z-[9999] w-80 max-w-[90vw] rounded-md border border-neutral-600 bg-neutral-950 p-3 text-left text-xs text-neutral-300 shadow-2xl ring-1 ring-black/40"
          >
            <p className="font-semibold text-nvidia">{info.label}</p>
            <p className="mt-1">{info.short}</p>
            {expanded ? (
              <p className="mt-2 border-t border-neutral-700 pt-2 text-neutral-400">
                {info.deep}
              </p>
            ) : (
              <p className="mt-2 text-[10px] text-neutral-500">
                Click for more
              </p>
            )}

            <span
              aria-hidden="true"
              style={{
                left: coords ? `${coords.arrowLeft}px` : "50%",
                transform: "translateX(-50%) rotate(45deg)",
              }}
              className="absolute -bottom-1.5 h-3 w-3 border-b border-r border-neutral-600 bg-neutral-950"
            />
          </div>,
          document.body,
        )}
    </span>
  );
}
