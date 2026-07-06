export default function CoolingDiagram() {
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

      {/* Air cooling */}
      <circle cx="105" cy="120" r="55" />
      <circle cx="105" cy="120" r="6" fill="currentColor" stroke="none" />
      <line x1="105" y1="120" x2="105" y2="70" />
      <line x1="105" y1="120" x2="150" y2="145" />
      <line x1="105" y1="120" x2="60" y2="145" />
      <text
        x="105"
        y="195"
        textAnchor="middle"
        className="fill-neutral-400"
        style={{ fontSize: 11 }}
      >
        Air cooling (fans)
      </text>

      {/* Liquid loop */}
      <rect x="230" y="100" width="50" height="40" rx="3" />
      <rect x="340" y="90" width="50" height="60" rx="3" />
      <line x1="350" y1="100" x2="380" y2="100" />
      <line x1="350" y1="115" x2="380" y2="115" />
      <line x1="350" y1="130" x2="380" y2="130" />
      <line x1="350" y1="145" x2="380" y2="145" />
      <path d="M280 108 C 310 90, 320 95, 340 100" />
      <path d="M280 132 C 310 150, 320 145, 340 140" />
      <text
        x="310"
        y="195"
        textAnchor="middle"
        className="fill-neutral-400"
        style={{ fontSize: 11 }}
      >
        Liquid cooling (loop)
      </text>
    </svg>
  );
}
