export default function StorageIcon({ size = 48, ...props }) {
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
      <rect x="3" y="8" width="18" height="10" rx="1.5" />
      <line x1="6" y1="12" x2="11" y2="12" />
      <line x1="6" y1="15" x2="11" y2="15" />
      <circle cx="17" cy="13.5" r="0.8" />
    </svg>
  );
}
