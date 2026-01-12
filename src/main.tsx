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
  principale: boolean;
};

/* =========================
   APP
========================= */
function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [veicoli, setVeicoli] = useState<Veicolo[]>([]);
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
    if (!session) return;

    caricaVeicoli();
  }, [session]);

  async function caricaVeicoli() {
    setErrore(null);

    const utente_id = session!.user.id; // collegato a utenti.utente_id

    const { data, error } = await supabase
      .from("veicoli")
      .select("veicolo_id, nomeveicolo, principale")
      .eq("utente_id", utente_id)
      .order("nomeveicolo");

    if (error) {
      setErrore(error.message);
    } else {
      setVeicoli(data || []);
    }
  }

  /* =========================
     SET VEICOLO PRINCIPALE
  ========================= */
  async function impostaPrincipale(veicolo_id: string) {
    if (!session) return;

    const utente_id = session.user.id;

    // reset
    await supabase
      .from("veicoli")
      .update({ principale: false })
      .eq("utente_id", utente_id);

    // set principale
    const { error } = await supabase
      .from("veicoli")
      .update({ principale: true })
      .eq("veicolo_id", veicolo_id);

    if (error) {
      setErrore(error.message);
    } else {
      caricaVeicoli();
    }
  }

  /* =========================
     LOGOUT
  ========================= */
  async function logout() {
    await supabase.auth.signOut();
    setVeicoli([]);
  }

  /* =========================
     RENDER
  ========================= */
  if (loading) return <p>Caricamento...</p>;

  if (!session) {
    return <Login />;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>CareAutoPro</h1>
      <p>Veicoli associati</p>

      {errore && <p style={{ color: "red" }}>{errore}</p>}

      {veicoli.length === 0 && <p>Nessun veicolo registrato</p>}

      <ul>
        {veicoli.map((v) => (
          <li key={v.veicolo_id} style={{ marginBottom: 8 }}>
            <strong>{v.nomeveicolo}</strong>{" "}
            {v.principale && "⭐"}
            {!v.principale && (
              <button
                style={{ marginLeft: 8 }}
                onClick={() => impostaPrincipale(v.veicolo_id)}
              >
                Imposta principale
              </button>
            )}
          </li>
        ))}
      </ul>

      <hr />
      <button onClick={logout}>Logout</button>
    </div>
  );
}

/* =========================
   LOGIN COMPONENT
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
   RENDER ROOT
========================= */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
