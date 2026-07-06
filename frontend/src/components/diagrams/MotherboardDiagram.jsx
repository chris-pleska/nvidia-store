import DiagramCallout from "./DiagramCallout.jsx";

export default function MotherboardDiagram() {
  return (
    <svg
      viewBox="0 0 380 260"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mx-auto h-auto w-full max-w-sm text-nvidia"
    >
      <rect x="30" y="30" width="320" height="200" rx="4" />

      <rect x="150" y="60" width="80" height="80" rx="3" strokeWidth="2" />

      <rect x="250" y="55" width="10" height="90" rx="2" />
      <rect x="266" y="55" width="10" height="90" rx="2" />
      <rect x="282" y="55" width="10" height="90" rx="2" />
      <rect x="298" y="55" width="10" height="90" rx="2" />

      <rect x="60" y="170" width="120" height="12" rx="2" />
      <rect x="60" y="190" width="120" height="12" rx="2" />

      <DiagramCallout
        x={190}
        y={100}
        stubX={190}
        stubY={20}
        label="CPU socket"
      />
      <DiagramCallout
        x={275}
        y={100}
        stubX={275}
        stubY={20}
        label="RAM slots"
      />
      <DiagramCallout
        x={120}
        y={176}
        stubX={120}
        stubY={245}
        label="PCIe slots"
      />
    </svg>
  );
}
