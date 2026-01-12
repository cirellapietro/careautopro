import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { createClient, Session } from "@supabase/supabase-js";

/* =========================
   SUPABASE
========================= */
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

/* =========================
   TYPES
========================= */
type Veicolo = {
  veicolo_id: string;
  nomeveicolo: string;
};

/* =========================
   APP
========================= */
function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [veicoli, setVeicoli] = useState<Veicolo[]>([]);
  const [veicoloAttivo, setVeicoloAttivo] = useState<string | null>(
    localStorage.getItem("veicolo_attivo")
  );
  const [errore, setErrore] = useState<string | null>(null);

  /* =========================
     SESSIONE
  ========================= */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /* =========================
     CARICA VEICOLI
  ========================= */
  useEffect(() => {
    if (session) caricaVeicoli();
  }, [session]);

  async function caricaVeicoli() {
    setErrore(null);

    const utente_id = session!.user.id;

    const { data, error } = await supabase
      .from("veicoli")
      .select("veicolo_id, nomeveicolo")
      .eq("utente_id", utente_id)
      .order("nomeveicolo");

    if (error) setErrore(error.message);
    else setVeicoli(data || []);
  }

  /* =========================
     CREA VEICOLO
  ========================= */
  async function creaVeicolo(nomeveicolo: string) {
    if (!session) return;

    const { error } = await supabase.from("veicoli").insert({
      utente_id: session.user.id,
      nomeveicolo,
    });

    if (error) setErrore(error.message);
    else caricaVeicoli();
  }

  /* =========================
     SELEZIONE VEICOLO ATTIVO
  ========================= */
  function selezionaVeicolo(id: string) {
    setVeicoloAttivo(id);
    localStorage.setItem("veicolo_attivo", id);
  }

  /* =========================
     LOGOUT
  ========================= */
  async function logout() {
    await supabase.auth.signOut();
    localStorage.removeItem("veicolo_attivo");
    setVeicoli([]);
  }

  if (loading) return <p>Caricamento...</p>;
  if (!session) return <Login />;

  return (
    <div style={{ padding: 24, maxWidth: 480, margin: "0 auto" }}>
      <h1>CareAutoPro</h1>

      {errore && <p style={{ color: "red" }}>{errore}</p>}

      <NuovoVeicolo onCreate={creaVeicolo} />

      <hr />

      <h3>I tuoi veicoli</h3>

      {veicoli.length === 0 && <p>Nessun veicolo inserito</p>}

      <ul>
        {veicoli.map((v) => (
          <li key={v.veicolo_id} style={{ marginBottom: 8 }}>
            <strong>{v.nomeveicolo}</strong>
            {veicoloAttivo === v.veicolo_id && " 🚗"}
            <button
              style={{ marginLeft: 8 }}
              onClick={() => selezionaVeicolo(v.veicolo_id)}
            >
              Usa
            </button>
          </li>
        ))}
      </ul>

      <hr />
      <button onClick={logout}>Logout</button>
    </div>
  );
}

/* =========================
   NUOVO VEICOLO
========================= */
function NuovoVeicolo({ onCreate }: { onCreate: (n: string) => void }) {
  const [nome, setNome] = useState("");

  function submit() {
    if (!nome.trim()) return;
    onCreate(nome.trim());
    setNome("");
  }

  return (
    <div>
      <h3>Aggiungi veicolo</h3>

      <input
        placeholder="Nome veicolo"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <br /><br />

      <button onClick={submit}>Salva veicolo</button>
    </div>
  );
}

/* =========================
   LOGIN
========================= */
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function login() {
    setMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setMsg(error.message);
  }

  return (
    <div style={{ padding: 24, maxWidth: 360, margin: "0 auto" }}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={login}>Accedi</button>

      {msg && <p style={{ color: "red" }}>{msg}</p>}
    </div>
  );
}

/* =========================
   ROOT
========================= */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
