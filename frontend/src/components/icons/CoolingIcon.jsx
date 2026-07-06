export default function CoolingIcon({ size = 48, ...props }) {
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
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="1.4" />
      <line x1="12" y1="12" x2="12" y2="4.5" />
      <line x1="12" y1="12" x2="18.9" y2="15.8" />
      <line x1="12" y1="12" x2="5.1" y2="15.8" />
    </svg>
  );
}
