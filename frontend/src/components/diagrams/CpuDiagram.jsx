import DiagramCallout from "./DiagramCallout.jsx";

export default function CpuDiagram() {
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
      <rect x="30" y="30" width="320" height="180" rx="4" />
      <circle cx="45" cy="45" r="3" />
      <circle cx="335" cy="45" r="3" />

      <rect x="140" y="70" width="100" height="100" rx="3" strokeWidth="2.5" />
      <path d="M140 70 L152 70 L140 82 Z" fill="currentColor" stroke="none" />

      {[160, 190, 220].map((gx) =>
        [90, 120, 150].map((gy) => (
          <circle key={`${gx}-${gy}`} cx={gx} cy={gy} r={1.2} />
        )),
      )}

      <DiagramCallout
        x={190}
        y={120}
        stubX={190}
        stubY={20}
        label="CPU socket"
      />
      <DiagramCallout
        x={60}
        y={175}
        stubX={60}
        stubY={215}
        label="Motherboard"
      />
    </svg>
  );
}
