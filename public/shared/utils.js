export function generateCoordinates({ lat, lng }) {
  if (!lat || !lng) throw new Error("invalid parameters");
  // Variação máxima para simular movimentos próximos
  const variation = 0.0035; // Ajuste conforme necessário

  // Gerar coordenadas
  const newLatitude = +(
    lat +
    Math.random() * 2 * variation -
    variation
  ).toFixed(6);
  const newLongitude = +(
    lng +
    Math.random() * 2 * variation -
    variation
  ).toFixed(6);

  return { lat: +newLatitude, lng: +newLongitude };
}
