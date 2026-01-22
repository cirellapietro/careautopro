// src/services/stimaKm.js
export const stimaKm = (tempoSecondi, tipoVeicolo = "auto") => {
  const velocitaMedia = {
    auto: 50,
    camion: 60,
    bus: 40,
    taxi: 45
  };
  const km = (velocitaMedia[tipoVeicolo] / 3600) * tempoSecondi;
  return Number(km.toFixed(2));
};
