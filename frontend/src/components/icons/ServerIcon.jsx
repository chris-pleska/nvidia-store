export default function ServerIcon({ size = 48, ...props }) {
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
      <rect x="2" y="8" width="20" height="8" rx="1" />
      <rect x="4" y="10.5" width="3" height="3" rx="0.4" />
      <rect x="8.5" y="10.5" width="3" height="3" rx="0.4" />
      <circle cx="17" cy="11" r="0.6" />
      <line x1="19" y1="10.5" x2="20.5" y2="10.5" />
      <line x1="19" y1="13.5" x2="20.5" y2="13.5" />
    </svg>
  );
}
