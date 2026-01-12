import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { createClient } from "@supabase/supabase-js";

/* =========================
   SUPABASE
========================= */
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

/* =========================
   APP
========================= */
function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* LOGIN EMAIL */
  async function loginEmail() {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setError(error.message);
    setLoading(false);
  }

  /* LOGIN SOCIAL */
  async function loginSocial(provider: "google" | "facebook") {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 360, margin: "0 auto" }}>
      <h1>CareAutoPro</h1>
      <p>Gestione manutenzione veicoli</p>

      <hr />

      <h3>Accedi</h3>

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

      <button onClick={loginEmail} disabled={loading}>
        Accedi
      </button>

      <hr />

      <button
        style={{ width: "100%", background: "#db4437" }}
        onClick={() => loginSocial("google")}
        disabled={loading}
      >
        Accedi con Google
      </button>

      <br /><br />

      <button
        style={{ width: "100%", background: "#1877f2" }}
        onClick={() => loginSocial("facebook")}
        disabled={loading}
      >
        Accedi con Facebook
      </button>

      {error && (
        <p style={{ color: "red", marginTop: 16 }}>{error}</p>
      )}
    </div>
  );
}

/* =========================
   RENDER
========================= */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
