import DiagramCallout from "./DiagramCallout.jsx";

export default function RamVsVramDiagram() {
  return (
    <svg
      viewBox="0 0 420 260"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mx-auto h-auto w-full max-w-sm text-nvidia"
    >
      <line
        x1="210"
        y1="20"
        x2="210"
        y2="220"
        strokeDasharray="4 4"
        opacity={0.4}
      />

      {/* RAM on a motherboard */}
      <rect x="20" y="150" width="170" height="20" rx="2" />
      <rect x="70" y="50" width="18" height="100" rx="2" />
      <line x1="70" y1="75" x2="88" y2="75" />
      <line x1="70" y1="100" x2="88" y2="100" />
      <line x1="70" y1="125" x2="88" y2="125" />

      <DiagramCallout
        x={79}
        y={90}
        stubX={79}
        stubY={20}
        label="RAM — general workspace"
      />

      {/* VRAM on a GPU board */}
      <rect x="230" y="60" width="160" height="90" rx="4" />
      <rect x="280" y="85" width="50" height="40" rx="2" />
      <rect x="262" y="80" width="14" height="10" />
      <rect x="336" y="80" width="14" height="10" />
      <rect x="262" y="120" width="14" height="10" />
      <rect x="336" y="120" width="14" height="10" />

      <DiagramCallout
        x={305}
        y={105}
        stubX={305}
        stubY={20}
        label="VRAM — GPU's own memory"
      />
    </svg>
  );
}
