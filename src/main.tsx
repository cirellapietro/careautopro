import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { createClient, Session } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

type Veicolo = {
  veicolo_id: string;
  nomeveicolo: string;
};

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [veicoli, setVeicoli] = useState<Veicolo[]>([]);
  const [pagina, setPagina] = useState<"veicoli" | "gps">("veicoli");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) return;

    supabase
      .from("veicoli")
      .select("veicolo_id, nomeveicolo")
      .eq("utente_id", session.user.id)
      .then(({ data }) => {
        setVeicoli(data || []);
      });
  }, [session]);

  if (!session) {
    return <Login />;
  }

  return (
    <div style={{ paddingBottom: 70 }}>
      {pagina === "veicoli" && (
        <div style={{ padding: 24 }}>
          <h2>Veicoli</h2>
          <ul>
            {veicoli.map((v) => (
              <li key={v.veicolo_id}>{v.nomeveicolo}</li>
            ))}
          </ul>
        </div>
      )}

      {pagina === "gps" && (
        <div style={{ padding: 24 }}>
          <h2>GPS</h2>
          <p>Schermata GPS (step successivo)</p>
        </div>
      )}

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
        <button onClick={() => supabase.auth.signOut()}>Logout</button>
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    await supabase.auth.signInWithPassword({ email, password });
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Login</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <br /><br />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />
      <button onClick={login}>Accedi</button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
