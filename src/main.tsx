import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function loginEmail() {
    setLoading(true);
    setMessage(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("LOGIN EMAIL:", data, error);

    if (error) {
      setMessage("Errore login: " + error.message);
    } else {
      setMessage("Login effettuato con successo");
    }

    setLoading(false);
  }

  async function loginSocial(provider: "google" | "facebook") {
    setLoading(true);
    setMessage(null);

    console.log("LOGIN SOCIAL:", provider);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error(error);
      setMessage("Errore " + provider + ": " + error.message);
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 360, margin: "0 auto" }}>
      <h1>CareAutoPro</h1>

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

      {message && (
        <p style={{ marginTop: 16, color: message.startsWith("Errore") ? "red" : "green" }}>
          {message}
        </p>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
