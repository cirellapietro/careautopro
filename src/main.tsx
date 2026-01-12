import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/* =========================
   SUPABASE SAFE INIT
========================= */
let supabase: SupabaseClient | null = null;
let supabaseError: string | null = null;

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anon) {
  supabaseError =
    "Supabase non configurato. Verifica VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY su Vercel.";
} else {
  supabase = createClient(url, anon);
}

/* =========================
   APP
========================= */
function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(supabaseError);
  const [loading, setLoading] = useState(false);

  async function loginEmail() {
    if (!supabase) return;

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setError(error.message);
    setLoading(false);
  }

  async function loginSocial(provider: "google" | "facebook") {
    if (!supabase) return;

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

      {error && (
        <p style={{ color: "red", fontSize: 14 }}>
          {error}
        </p>
      )}

      <h3>Accedi</h3>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={!supabase}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={!supabase}
      />
      <br /><br />

      <button onClick={loginEmail} disabled={!supabase || loading}>
        Accedi
      </button>

      <hr />

      <button
        style={{ width: "100%", background: "#db4437" }}
        onClick={() => loginSocial("google")}
        disabled={!supabase || loading}
      >
        Accedi con Google
      </button>

      <br /><br />

      <button
        style={{ width: "100%", background: "#1877f2" }}
        onClick={() => loginSocial("facebook")}
        disabled={!supabase || loading}
      >
        Accedi con Facebook
      </button>
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
