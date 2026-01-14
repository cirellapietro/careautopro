import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const Field = ({ label, value }) => (
  <div className="field">
    <label>{label}</label>
    <div>{value ?? "—"}</div>
  </div>
);

export default function VeicoliPage() {
  const [veicoli, setVeicoli] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadVeicoli();
  }, []);

  const loadVeicoli = async () => {
    const { data, error } = await supabase
      .from("veicoli")
      .select("*")
      .order("nomeveicolo");

    if (!error) setVeicoli(data || []);
  };

  const selectVeicolo = (v) => {
    setSelected(v);
    setForm({ ...v });
    setIsEditing(false);
  };

  const saveVeicolo = async () => {
    await supabase
      .from("veicoli")
      .update(form)
      .eq("veicolo_id", form.veicolo_id);

    await loadVeicoli();
    setSelected(form);
    setIsEditing(false);
  };

  if (!selected) {
    return (
      <div>
        <h2>Veicoli</h2>
        {veicoli.map((v) => (
          <div key={v.veicolo_id} onClick={() => selectVeicolo(v)}>
            {v.nomeveicolo} ({v.targa ?? "—"})
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2>Dettaglio veicolo</h2>

      {/* ANAGRAFICA */}
      <Field label="Nome veicolo" value={selected.nomeveicolo} />
      <Field label="Targa" value={selected.targa} />
      <Field label="Tipo veicolo" value={selected.tipoveicolo_id} />
      <Field label="Data immatricolazione" value={selected.dataimmatricolazione} />

      {/* TECNICI */}
      <Field label="KW" value={selected.kw} />
      <Field label="Cilindrata" value={selected.cilindrata} />

      {/* KM */}
      <Field label="Km attuali" value={selected.kmattuali} />
      <Field label="Km da GPS" value={selected.kmdagps} />
      <Field label="Km annui" value={selected.kmanno} />
      <Field label="Km effettivi" value={selected.kmeffettivi} />
      <Field label="Km presunti" value={selected.kmpresunti} />

      {/* EDIT */}
      {isEditing && (
        <>
          <input
            value={form.nomeveicolo ?? ""}
            onChange={(e) => setForm({ ...form, nomeveicolo: e.target.value || null })}
          />
          <input
            value={form.targa ?? ""}
            onChange={(e) => setForm({ ...form, targa: e.target.value || null })}
          />
          <input
            type="number"
            value={form.kw ?? ""}
            onChange={(e) => setForm({ ...form, kw: e.target.value || null })}
          />
        </>
      )}

      {!isEditing ? (
        <button onClick={() => setIsEditing(true)}>Modifica</button>
      ) : (
        <>
          <button onClick={saveVeicolo}>Salva</button>
          <button onClick={() => {
            setForm({ ...selected });
            setIsEditing(false);
          }}>
            Annulla
          </button>
        </>
      )}
    </div>
  );
}