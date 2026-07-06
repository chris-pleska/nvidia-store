import DiagramCallout from "./DiagramCallout.jsx";

export default function GpuDiagram() {
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
      <rect x="40" y="40" width="300" height="130" rx="6" />
      <rect x="90" y="75" width="70" height="55" rx="3" />

      <rect x="70" y="60" width="16" height="12" />
      <rect x="168" y="60" width="16" height="12" />
      <rect x="70" y="118" width="16" height="12" />
      <rect x="168" y="118" width="16" height="12" />

      <circle cx="235" cy="105" r="22" />
      <circle cx="290" cy="105" r="22" />

      <rect x="120" y="170" width="140" height="8" />
      <line x1="190" y1="170" x2="190" y2="178" />

      <DiagramCallout x={125} y={102} stubX={125} stubY={20} label="GPU chip" />
      <DiagramCallout x={262} y={105} stubX={262} stubY={20} label="Fans" />
      <DiagramCallout
        x={78}
        y={124}
        stubX={78}
        stubY={215}
        label="VRAM chips"
      />
      <DiagramCallout
        x={190}
        y={174}
        stubX={190}
        stubY={215}
        label="PCIe connector"
      />
    </svg>
  );
}
