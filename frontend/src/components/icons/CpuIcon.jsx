export default function CpuIcon({ size = 48, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="7" y="7" width="10" height="10" rx="1" />
      <rect x="10" y="10" width="4" height="4" rx="0.5" />
      <line x1="9" y1="7" x2="9" y2="4" />
      <line x1="15" y1="7" x2="15" y2="4" />
      <line x1="9" y1="17" x2="9" y2="20" />
      <line x1="15" y1="17" x2="15" y2="20" />
      <line x1="7" y1="9" x2="4" y2="9" />
      <line x1="7" y1="15" x2="4" y2="15" />
      <line x1="17" y1="9" x2="20" y2="9" />
      <line x1="17" y1="15" x2="20" y2="15" />
    </svg>
  );
}
