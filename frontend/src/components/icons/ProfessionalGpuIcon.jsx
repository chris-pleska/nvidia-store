export default function ProfessionalGpuIcon({ size = 48, ...props }) {
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
      <rect x="2" y="7" width="20" height="10" rx="1.5" />
      <rect x="0.5" y="9" width="2" height="6" />
      <circle cx="12" cy="12" r="3.2" />
      <line x1="18" y1="9" x2="18" y2="15" />
      <line x1="19.5" y1="9" x2="19.5" y2="15" />
    </svg>
  );
}
