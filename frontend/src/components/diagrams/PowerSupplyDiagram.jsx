import DiagramCallout from "./DiagramCallout.jsx";

export default function PowerSupplyDiagram() {
  return (
    <svg
      viewBox="0 0 380 240"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mx-auto h-auto w-full max-w-sm text-nvidia"
    >
      <rect x="30" y="90" width="90" height="70" rx="4" />
      <line x1="50" y1="100" x2="50" y2="150" />
      <line x1="65" y1="100" x2="65" y2="150" />
      <line x1="80" y1="100" x2="80" y2="150" />
      <line x1="30" y1="115" x2="10" y2="115" />
      <line x1="30" y1="135" x2="10" y2="135" />

      <rect x="230" y="40" width="120" height="40" rx="3" />
      <text
        x="290"
        y="64"
        textAnchor="middle"
        className="fill-neutral-400"
        style={{ fontSize: 11 }}
      >
        GPU
      </text>

      <rect x="230" y="100" width="120" height="40" rx="3" />
      <text
        x="290"
        y="124"
        textAnchor="middle"
        className="fill-neutral-400"
        style={{ fontSize: 11 }}
      >
        CPU
      </text>

      <rect x="230" y="160" width="120" height="40" rx="3" />
      <text
        x="290"
        y="184"
        textAnchor="middle"
        className="fill-neutral-400"
        style={{ fontSize: 11 }}
      >
        Motherboard
      </text>

      <line x1="120" y1="110" x2="222" y2="60" />
      <path d="M222 60 L212 56 L214 66 Z" fill="currentColor" stroke="none" />

      <line x1="120" y1="125" x2="222" y2="120" />
      <path d="M222 120 L212 115 L212 125 Z" fill="currentColor" stroke="none" />

      <line x1="120" y1="140" x2="222" y2="180" />
      <path d="M222 180 L212 174 L214 184 Z" fill="currentColor" stroke="none" />

      <DiagramCallout
        x={75}
        y={125}
        stubX={75}
        stubY={215}
        label="Power Supply"
      />
    </svg>
  );
}
