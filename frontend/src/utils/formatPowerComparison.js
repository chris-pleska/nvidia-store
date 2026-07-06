export function formatPowerComparison(powerContext) {
  if (!powerContext) return null;

  const { homes_equivalent, ev_battery_fraction } = powerContext;
  const homesLabel = homes_equivalent === 1 ? "home" : "homes";
  const percent = (ev_battery_fraction * 100).toFixed(1).replace(/\.0$/, "");

  return `about ${homes_equivalent} average ${homesLabel}, or drains roughly ${percent}% of an EV battery per hour of continuous use`;
}
