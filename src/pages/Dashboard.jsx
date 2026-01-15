import { useTracking } from "./TrackingContext";

export default function Dashboard() {
  const { veicoloAttivo, km, minuti } = useTracking();

  if (!veicoloAttivo)
    return <p>Seleziona un veicolo da tracciare</p>;

  return (
    <>
      <h2>{veicoloAttivo.nomeveicolo}</h2>
      <p>Km percorsi: {km.toFixed(2)}</p>
      <p>Tempo: {minuti} minuti</p>
    </>
  );
}
