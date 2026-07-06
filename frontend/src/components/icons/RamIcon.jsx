export default function RamIcon({ size = 48, ...props }) {
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
      <rect x="5" y="4" width="14" height="14" rx="1" />
      <line x1="8" y1="4" x2="8" y2="18" />
      <line x1="12" y1="4" x2="12" y2="18" />
      <line x1="16" y1="4" x2="16" y2="18" />
      <line x1="7" y1="18" x2="7" y2="20" />
      <line x1="10" y1="18" x2="10" y2="20" />
      <line x1="14" y1="18" x2="14" y2="20" />
      <line x1="17" y1="18" x2="17" y2="20" />
    </svg>
  );
}
