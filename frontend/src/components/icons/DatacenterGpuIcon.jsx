export default function DatacenterGpuIcon({ size = 48, ...props }) {
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
      <rect x="4" y="5" width="16" height="12" rx="1.5" />
      <rect x="9" y="9" width="6" height="4" rx="0.5" />
      <line x1="7" y1="17" x2="7" y2="19.5" />
      <line x1="10.5" y1="17" x2="10.5" y2="19.5" />
      <line x1="14" y1="17" x2="14" y2="19.5" />
      <line x1="17" y1="17" x2="17" y2="19.5" />
    </svg>
  );
}
