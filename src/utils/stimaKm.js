/**
 * Calcola i km stimati in assenza di GPS
 * @param {number} durataSecondi - tempo trascorso in secondi
 * @param {number} velocitaMedia - km/h (default 40)
 * @returns {number} km stimati
 */
export function stimaKm(durataSecondi, velocitaMedia = 40) {
  const ore = durataSecondi / 3600;
  return ore * velocitaMedia;
}