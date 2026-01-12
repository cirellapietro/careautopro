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
  const [pagina, setPagina] = useState<"veicoli" | "gps">("veicoli");
  const [veicoli, setVeicoli] = useState<Veicolo[]>([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     SESSIONE
  ========================= */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  /* =========================
     VEICOLI
  ========================= */
  useEffect(() => {
    if (!session) return;

    supabase
      .from("veicoli")
      .select("veicolo_id, nomeveicolo")
      .eq("utente_id", session.user.id)
      .order("nomeveicolo")
      .then(({ data }) => {
        setVeicoli(data || []);
      });
  }, [session]);

  async function aggiungiVeicolo(nomeveicolo: string) {
    if (!session) return;

    await supabase.from("veicoli").insert({
      utente_id: session.user.id,
      nomeveicolo,
    });

    const { data } = await supabase
      .from("veicoli")
      .select("veicolo_id, nomeveicolo")
      .eq("utente_id", session.user.id)
      .order("nomeveicolo");

    setVeicoli(data || []);
  }

  /* =========================
     LOGOUT CORRETTO
  ========================= */
  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
    setVeicoli([]);
    setPagina("veicoli");
  }

  if (loading) return <p>Caricamento...</p>;
  if (!session) return <Login />;

  return (
    <div style={{ paddingBottom: 70 }}>
      {pagina === "veicoli" && (
        <VeicoliPage veicoli={veicoli} onAdd={aggiungiVeicolo} />
      )}

      {pagina === "gps" && (
        <div style={{ padding: 24 }}>
          <h2>GPS</h2>
          <p>Tracciamento (step successivo)</p>
        </div>
      )}

      {/* MENU BASSO */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          background: "#0f172a",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          color: "white",
        }}
      >
        <button onClick={() => setPagina("veicoli")}>Veicoli</button>
        <button onClick={() => setPagina("gps")}>GPS</button>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

/* =========================
   VEICOLI PAGE
========================= */
function VeicoliPage({
  veicoli,
  onAdd,
}: {
  veicoli: Veicolo[];
  onAdd: (n: string) => void;
}) {
  const [nome, setNome] = useState("");

  function submit() {
    if (!nome.trim()) return;
    onAdd(nome.trim());
    setNome("");
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>I tuoi veicoli</h2>

      <input
        placeholder="Nome veicolo"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <br /><br />
      <button onClick={submit}>Aggiungi veicolo</button>

      <hr />

      <ul>
        {veicoli.map((v) => (
          <li key={v.veicolo_id}>{v.nomeveicolo}</li>
        ))}
      </ul>
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

  async function loginSocial(provider: "google" | "facebook") {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
  }

  return (
    <div style={{ padding: 24, maxWidth: 360, margin: "0 auto" }}>
      <h2>Login</h2>

      <input
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

      <hr />

      <button
        style={{ width: "100%", background: "#db4437" }}
        onClick={() => loginSocial("google")}
      >
        Accedi con Google
      </button>

      <br /><br />

      <button
        style={{ width: "100%", background: "#1877f2" }}
        onClick={() => loginSocial("facebook")}
      >
        Accedi con Facebook
      </button>

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
