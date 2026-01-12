import React from "react";
import ReactDOM from "react-dom/client";

function App() {
  return (
    <div style={{ padding: 24 }}>
      <h1>CareAutoPro</h1>

      <p>Gestione manutenzione veicoli</p>

      <hr />

      <h3>Accesso</h3>

      <input type="email" placeholder="Email" />
      <br /><br />
      <input type="password" placeholder="Password" />
      <br /><br />
      <button>Accedi</button>

      <p style={{ marginTop: 16, fontSize: 14, color: "#475569" }}>
        (Autenticazione Supabase verrà collegata nello step successivo)
      </p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
