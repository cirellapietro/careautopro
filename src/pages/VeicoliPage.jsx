import { supabase } from "./supabase";
import { useTracking } from "./TrackingContext";

export default function VehiclesPage({ profiloutente_id }) {
  const { setVeicoloAttivo } = useTracking();
  const [veicoli, setVeicoli] = useState([]);

  useEffect(() => {
    supabase
      .from("veicoli")
      .select("*")
      .eq("profiloutente_id", profiloutente_id)
      .then(({ data }) => setVeicoli(data));
  }, []);

  async function toggleTracking(id) {
    await supabase
      .from("veicoli")
      .update({ tracking_attivo: false })
      .eq("profiloutente_id", profiloutente_id);

    const { data } = await supabase
      .from("veicoli")
      .update({ tracking_attivo: true })
      .eq("veicolo_id", id)
      .select()
      .single();

    setVeicoloAttivo(data);
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Veicolo</th>
          <th>Targa</th>
          <th>Tracking</th>
        </tr>
      </thead>
      <tbody>
        {veicoli.map(v => (
          <tr key={v.veicolo_id}>
            <td>{v.nomeveicolo}</td>
            <td>{v.targa}</td>
            <td>
              <button onClick={() => toggleTracking(v.veicolo_id)}>
                {v.tracking_attivo ? "ON" : "OFF"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
            }
