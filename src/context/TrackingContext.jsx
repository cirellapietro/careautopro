import { startRealTracking, stopRealTracking } from '../services/trackingService';
import { startEstimatedTracking } from '../services/trackingFallback';

let fallbackTimer = null;

async function startTracking(onUpdate) {
  try {
    startRealTracking(onUpdate);
  } catch (e) {
    fallbackTimer = startEstimatedTracking(onUpdate);
  }
}

function stopTracking() {
  stopRealTracking();
  if (fallbackTimer) clearInterval(fallbackTimer);
}