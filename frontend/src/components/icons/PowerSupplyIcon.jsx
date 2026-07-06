export default function PowerSupplyIcon({ size = 48, ...props }) {
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
      <rect x="3" y="5" width="17" height="14" rx="1.5" />
      <line x1="8" y1="9" x2="8" y2="15" />
      <line x1="11" y1="9" x2="11" y2="15" />
      <line x1="14" y1="9" x2="14" y2="15" />
      <line x1="20" y1="10" x2="22" y2="10" />
      <line x1="20" y1="14" x2="22" y2="14" />
    </svg>
  );
}
