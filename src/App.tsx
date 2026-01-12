export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>CareAutoPro</h1>

      <p>Applicazione caricata correttamente ✅</p>

      <hr />

      <h2>Accesso</h2>

      <input type="email" placeholder="Email" />
      <br /><br />

      <input type="password" placeholder="Password" />
      <br /><br />

      <button>Accedi</button>

      <hr />

      <p style={{ fontSize: 12, color: "#64748b" }}>
        Versione PWA – test render
      </p>
    </div>
  );
}
