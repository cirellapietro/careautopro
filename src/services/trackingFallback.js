let startTime = null;
let lastTick = null;

export function startEstimatedTracking(onUpdate) {
  startTime = Date.now();
  lastTick = Date.now();

  const AVG_SPEED_KMH = 40; // configurabile (taxi/camion/bus)

  return setInterval(() => {
    const now = Date.now();
    const deltaHours = (now - lastTick) / 1000 / 3600;
    lastTick = now;

    const distance = AVG_SPEED_KMH * deltaHours;

    onUpdate({
      distanceKm: distance,
      estimated: true,
      timestamp: now
    });
  }, 10000);
}