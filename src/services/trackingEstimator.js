// src/services/trackingEstimator.js

export function stimaKm(tempoSecondi, velocitaMediaKmH = 30) {
  const ore = tempoSecondi / 3600;
  return Number((ore * velocitaMediaKmH).toFixed(2));
}

export function stimaTempo(startTime) {
  const now = Date.now();
  return Math.floor((now - startTime) / 1000);
}
