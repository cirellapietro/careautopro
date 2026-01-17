import { Geolocation } from '@capacitor/geolocation';
import { App } from '@capacitor/app';

let watchId = null;
let lastPosition = null;

export function startRealTracking(onUpdate) {
  if (watchId) return;

  watchId = Geolocation.watchPosition(
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    },
    (position, err) => {
      if (err || !position) return;

      const { latitude, longitude, speed } = position.coords;
      const timestamp = position.timestamp;

      let distance = 0;
      if (lastPosition) {
        distance = haversine(
          lastPosition.latitude,
          lastPosition.longitude,
          latitude,
          longitude
        );
      }

      lastPosition = { latitude, longitude, timestamp };

      onUpdate({
        latitude,
        longitude,
        distanceKm: distance,
        speed: speed || 0,
        timestamp
      });
    }
  );
}

export function stopRealTracking() {
  if (watchId) {
    Geolocation.clearWatch({ id: watchId });
    watchId = null;
    lastPosition = null;
  }
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}