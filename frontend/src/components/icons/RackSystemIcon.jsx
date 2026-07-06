export default function RackSystemIcon({ size = 48, ...props }) {
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
      <rect x="4" y="2" width="16" height="20" rx="1" />
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="10" x2="20" y2="10" />
      <line x1="4" y1="14" x2="20" y2="14" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <line x1="5.5" y1="4" x2="8" y2="4" />
      <line x1="5.5" y1="8" x2="8" y2="8" />
      <line x1="5.5" y1="12" x2="8" y2="12" />
      <line x1="5.5" y1="16" x2="8" y2="16" />
      <line x1="5.5" y1="20" x2="8" y2="20" />
    </svg>
  );
}
