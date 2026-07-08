const HOME_CONTINUOUS_DRAW_WATTS = 1200;
const EV_BATTERY_KWH = 90;

export function humanizePower(watts) {
  if (watts == null) return null;

  return {
    homes_equivalent: Math.round((watts / HOME_CONTINUOUS_DRAW_WATTS) * 10) / 10,
    ev_battery_fraction:
      Math.round((watts / 1000 / EV_BATTERY_KWH) * 10000) / 10000,
  };
}
