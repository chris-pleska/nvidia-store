import DiagramCallout from "./DiagramCallout.jsx";

export default function StorageDiagram() {
  return (
    <svg
      viewBox="0 0 380 220"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mx-auto h-auto w-full max-w-sm text-nvidia"
    >
      <rect x="30" y="70" width="140" height="80" rx="4" />
      <line x1="50" y1="95" x2="90" y2="95" />
      <line x1="50" y1="115" x2="90" y2="115" />
      <circle cx="150" cy="90" r="2" />

      <rect x="290" y="85" width="60" height="50" rx="3" />
      <line x1="300" y1="100" x2="340" y2="100" />
      <line x1="300" y1="115" x2="340" y2="115" />

      <line x1="175" y1="110" x2="270" y2="110" />
      <path d="M270 110 L260 104 L260 116 Z" fill="currentColor" stroke="none" />

      <text
        x="222"
        y="95"
        textAnchor="middle"
        className="fill-neutral-400"
        style={{ fontSize: 11 }}
      >
        model file → VRAM
      </text>

      <DiagramCallout x={100} y={110} stubX={100} stubY={190} label="SSD" />
    </svg>
  );
}
