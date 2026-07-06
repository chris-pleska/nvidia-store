export default function NetworkingIcon({ size = 48, ...props }) {
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
      <circle cx="12" cy="5" r="2" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="19" cy="18" r="2" />
      <line x1="10.6" y1="6.7" x2="6.4" y2="16.3" />
      <line x1="13.4" y1="6.7" x2="17.6" y2="16.3" />
      <line x1="7" y1="18" x2="17" y2="18" />
    </svg>
  );
}
