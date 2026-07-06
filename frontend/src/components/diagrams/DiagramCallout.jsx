export default function DiagramCallout({
  x,
  y,
  stubX,
  stubY,
  label,
  anchor = "middle",
}) {
  const labelY = stubY > y ? stubY + 12 : stubY - 6;

  return (
    <>
      <circle cx={x} cy={y} r={2.2} fill="currentColor" stroke="none" />
      <line x1={x} y1={y} x2={stubX} y2={stubY} opacity={0.4} />
      <text
        x={stubX}
        y={labelY}
        textAnchor={anchor}
        className="fill-neutral-400"
        style={{ fontSize: 11 }}
      >
        {label}
      </text>
    </>
  );
}
