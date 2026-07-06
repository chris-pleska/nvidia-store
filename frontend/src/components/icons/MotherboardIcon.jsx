export default function MotherboardIcon({ size = 48, ...props }) {
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
      <rect x="3" y="3" width="18" height="18" rx="1.5" />
      <rect x="6" y="6" width="5" height="4" rx="0.5" />
      <rect x="14" y="6" width="4" height="9" rx="0.5" />
      <line x1="6" y1="13" x2="11" y2="13" />
      <line x1="6" y1="16" x2="11" y2="16" />
      <circle cx="4.5" cy="4.5" r="0.4" />
      <circle cx="19.5" cy="19.5" r="0.4" />
    </svg>
  );
}
