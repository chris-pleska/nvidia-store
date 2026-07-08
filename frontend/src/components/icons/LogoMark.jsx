export default function LogoMark({ size = 32, ...props }) {
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
      <circle cx="12" cy="12" r="9.3" opacity="0.5" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
      <path d="M 12,9.6 Q 14.14,6.18 18.91,5.78" />
      <path d="M 14.28,11.26 Q 18.2,12.23 20.05,16.65" />
      <path d="M 13.41,13.94 Q 13.69,17.96 10.07,21.1" />
      <path d="M 10.59,13.94 Q 6.85,15.45 2.75,12.97" />
      <path d="M 9.72,11.26 Q 7.13,8.17 8.22,3.5" />
    </svg>
  );
}
