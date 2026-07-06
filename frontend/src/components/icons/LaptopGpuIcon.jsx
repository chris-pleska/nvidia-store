export default function LaptopGpuIcon({ size = 48, ...props }) {
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
      <rect x="5" y="3" width="14" height="10" rx="1" />
      <line x1="12" y1="13" x2="12" y2="15.5" />
      <rect x="2" y="15.5" width="20" height="1.8" rx="0.9" />
    </svg>
  );
}
