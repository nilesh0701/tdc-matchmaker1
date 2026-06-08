export default function TdcLogo({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      className={className}
    >
      <circle cx="20" cy="24" r="14" fill="#C2185B" opacity="0.85" />
      <circle cx="28" cy="24" r="14" fill="#C2185B" opacity="0.55" />
    </svg>
  );
}
