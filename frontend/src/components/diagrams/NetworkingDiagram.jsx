export default function NetworkingDiagram() {
  return (
    <svg
      viewBox="0 0 420 240"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mx-auto h-auto w-full max-w-sm text-nvidia"
    >
      <line
        x1="205"
        y1="20"
        x2="205"
        y2="220"
        strokeDasharray="4 4"
        opacity={0.4}
      />

      {/* Datacenter cluster: thick high-speed link */}
      <rect x="20" y="90" width="60" height="40" rx="2" />
      <rect x="130" y="90" width="60" height="40" rx="2" />
      <line x1="80" y1="110" x2="130" y2="110" strokeWidth="4" />
      <text
        x="105"
        y="80"
        textAnchor="middle"
        className="fill-neutral-400"
        style={{ fontSize: 11 }}
      >
        NVLink / InfiniBand
      </text>
      <text
        x="105"
        y="150"
        textAnchor="middle"
        className="fill-neutral-400"
        style={{ fontSize: 11 }}
      >
        Datacenter cluster
      </text>

      {/* Desktop towers: regular network */}
      <rect x="230" y="80" width="35" height="60" rx="2" />
      <rect x="330" y="80" width="35" height="60" rx="2" />
      <line x1="265" y1="110" x2="330" y2="110" strokeWidth="1" />
      <text
        x="297"
        y="72"
        textAnchor="middle"
        className="fill-neutral-400"
        style={{ fontSize: 11 }}
      >
        Regular network
      </text>
      <text
        x="297"
        y="160"
        textAnchor="middle"
        className="fill-neutral-400"
        style={{ fontSize: 11 }}
      >
        A pile of desktop cards
      </text>
    </svg>
  );
}
