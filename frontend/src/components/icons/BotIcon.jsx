export default function BotIcon({ size = 28, ...props }) {
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
      <rect x="5" y="7" width="14" height="11" rx="3" />
      <line x1="12" y1="7" x2="12" y2="4" />
      <circle cx="12" cy="3" r="1" />
      <rect x="3.2" y="10" width="1.6" height="3" rx="0.8" />
      <rect x="19.2" y="10" width="1.6" height="3" rx="0.8" />
      <circle cx="9" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <path d="M9 15 Q12 17 15 15" />
    </svg>
  );
}
