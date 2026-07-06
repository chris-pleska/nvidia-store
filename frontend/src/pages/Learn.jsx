import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CoolingDiagram from "../components/diagrams/CoolingDiagram.jsx";
import CpuDiagram from "../components/diagrams/CpuDiagram.jsx";
import GpuDiagram from "../components/diagrams/GpuDiagram.jsx";
import MotherboardDiagram from "../components/diagrams/MotherboardDiagram.jsx";
import NetworkingDiagram from "../components/diagrams/NetworkingDiagram.jsx";
import PowerSupplyDiagram from "../components/diagrams/PowerSupplyDiagram.jsx";
import RamVsVramDiagram from "../components/diagrams/RamVsVramDiagram.jsx";
import StorageDiagram from "../components/diagrams/StorageDiagram.jsx";
import DesktopGpuIcon from "../components/icons/DesktopGpuIcon.jsx";
import CoolingIcon from "../components/icons/CoolingIcon.jsx";
import CpuIcon from "../components/icons/CpuIcon.jsx";
import MotherboardIcon from "../components/icons/MotherboardIcon.jsx";
import NetworkingIcon from "../components/icons/NetworkingIcon.jsx";
import PowerSupplyIcon from "../components/icons/PowerSupplyIcon.jsx";
import RackSystemIcon from "../components/icons/RackSystemIcon.jsx";
import RamIcon from "../components/icons/RamIcon.jsx";
import StorageIcon from "../components/icons/StorageIcon.jsx";
import { API_BASE_URL } from "../config.js";

const SECTIONS = [
  {
    slug: "gpu",
    label: "GPU",
    Icon: DesktopGpuIcon,
    Diagram: GpuDiagram,
    definition: "The chip that does the actual AI work.",
    paragraph:
      "Originally built to draw video game graphics, GPUs turned out to be perfect for AI because both jobs involve doing millions of small calculations at once.",
    whenItMatters:
      "This is the single most important component for AI — everything else on this page exists to support it.",
    link: { to: "/shop", label: "Browse the Shop" },
  },
  {
    slug: "cpu",
    label: "CPU",
    Icon: CpuIcon,
    Diagram: CpuDiagram,
    definition: "The computer's general-purpose brain.",
    paragraph:
      "Handles everything that isn't the AI math itself: running the operating system, loading data, coordinating the GPUs.",
    whenItMatters:
      "AI servers need decent CPUs, but you rarely choose a machine because of one — the GPUs decide.",
  },
  {
    slug: "ram-vs-vram",
    label: "RAM vs VRAM",
    Icon: RamIcon,
    Diagram: RamVsVramDiagram,
    definition: "Two different memories that are easy to confuse.",
    paragraph:
      "RAM is the computer's general workspace; VRAM is memory built into the GPU itself. An AI model must fit in VRAM to run at full speed — that's why every product here lists VRAM, and why our Model Advisor math is all about it.",
    whenItMatters: "VRAM is usually the deciding number when buying AI hardware.",
    link: { to: "/model-advisor", label: "Go to Model Advisor" },
  },
  {
    slug: "storage",
    label: "Storage",
    Icon: StorageIcon,
    Diagram: StorageDiagram,
    definition: "Where models and data live when they're not running.",
    paragraph:
      "SSDs hold the model files (often hundreds of gigabytes each) and training data.",
    whenItMatters:
      "Mostly about capacity and loading speed — a slow disk means waiting minutes each time a big model loads.",
  },
  {
    slug: "power-supply",
    label: "Power Supply",
    Icon: PowerSupplyIcon,
    Diagram: PowerSupplyDiagram,
    definition: "Converts wall power into what the components use.",
    paragraph: "Every watt a GPU draws has to come through here, with headroom.",
    whenItMatters:
      "High-end GPUs are power-hungry — a 575W card needs a much beefier PSU than a typical PC has, and multi-GPU servers need thousands of watts.",
  },
  {
    slug: "motherboard",
    label: "Motherboard",
    Icon: MotherboardIcon,
    Diagram: MotherboardDiagram,
    definition: "The board everything plugs into.",
    paragraph:
      "Decides how many GPUs fit, how fast they talk to each other, and how much RAM you can add.",
    whenItMatters:
      "For multi-GPU builds, the motherboard's slot layout and wiring (PCIe lanes) can quietly bottleneck everything.",
  },
  {
    slug: "networking",
    label: "Networking",
    Icon: NetworkingIcon,
    Diagram: NetworkingDiagram,
    definition: "How machines talk to each other.",
    paragraph:
      "Regular office networking is fine for browsing; AI clusters use special high-speed links — NVLink between GPUs, InfiniBand between servers — so many GPUs can act like one big one.",
    whenItMatters:
      "This is the real difference between a datacenter cluster and a pile of desktop cards — see our cluster explainer.",
    link: { to: "/help-me-choose", label: "Help Me Choose" },
  },
  {
    slug: "clusters",
    label: "What's a Cluster?",
    Icon: RackSystemIcon,
    isClusterSection: true,
  },
  {
    slug: "cooling",
    label: "Cooling",
    Icon: CoolingIcon,
    Diagram: CoolingDiagram,
    definition: "Getting the heat back out.",
    paragraph:
      "All those watts become heat. Desktops use fans; dense AI racks generate so much heat that they're liquid-cooled — pipes carry coolant directly to the chips.",
    whenItMatters:
      "Cooling is why you can't just stack datacenter GPUs in a closet — the GB200 rack in our shop dissipates as much heat as several dozen space heaters.",
  },
];

export default function Learn() {
  const location = useLocation();
  const [clusterExplainer, setClusterExplainer] = useState(null);

  useEffect(() => {
    if (!location.hash) return;

    const target = document.getElementById(location.hash.slice(1));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/cluster-explainer`)
      .then((res) => res.json())
      .then(setClusterExplainer)
      .catch(() => setClusterExplainer(null));
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold">
        Learn the <span className="text-nvidia">Hardware</span>
      </h1>
      <p className="mt-2 text-neutral-400">
        A plain-language guide to the parts that make up a computer, and why
        each one matters for running AI models.
      </p>

      <nav className="sticky top-0 z-30 mt-8 rounded-lg border border-neutral-800 bg-neutral-950/95 p-4 backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Table of Contents
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {SECTIONS.map(({ slug, label }) => (
            <Link
              key={slug}
              to={`#${slug}`}
              className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 transition-colors hover:border-nvidia/50 hover:text-nvidia"
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="mt-8 flex flex-col gap-10">
        {SECTIONS.map(
          ({
            slug,
            label,
            Icon,
            Diagram,
            definition,
            paragraph,
            whenItMatters,
            link,
            isClusterSection,
          }) => (
            <section
              key={slug}
              id={slug}
              className="scroll-mt-24 rounded-lg border border-neutral-800 bg-neutral-900 p-6"
            >
              <div className="flex items-center gap-3">
                <span className="text-nvidia">
                  <Icon size={32} />
                </span>
                <h2 className="text-xl font-semibold text-neutral-100">
                  {label}
                </h2>
              </div>

              {Diagram && (
                <div className="mt-4">
                  <Diagram />
                </div>
              )}

              {isClusterSection ? (
                clusterExplainer ? (
                  <>
                    <p className="mt-4 font-semibold text-neutral-100">
                      {clusterExplainer.definition}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                      {clusterExplainer.real_clustering}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                      {clusterExplainer.honest_contrast}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                      When we show a cluster build, we add up the memory,
                      power, and price of every unit — that combined memory
                      is what determines which models fit.
                    </p>
                  </>
                ) : (
                  <p className="mt-4 text-sm text-neutral-500">Loading...</p>
                )
              ) : (
                <>
                  <p className="mt-4 font-semibold text-neutral-100">
                    {definition}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                    {paragraph}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                    <span className="font-medium text-nvidia">
                      When it matters for AI:
                    </span>{" "}
                    {whenItMatters}
                  </p>
                </>
              )}

              {link && (
                <Link
                  to={link.to}
                  className="mt-4 inline-block rounded-md border border-nvidia/40 px-3 py-2 text-sm font-medium text-nvidia transition-colors hover:bg-nvidia/10"
                >
                  {link.label}
                </Link>
              )}
            </section>
          ),
        )}
      </div>
    </main>
  );
}
