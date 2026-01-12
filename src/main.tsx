import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element non trovato");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
  /* =======================
     AUTH
  ======================= */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const loginEmailPassword = async () => {
    setErroreLogin(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setErroreLogin(error.message);
  };

  const loginGoogle = () =>
    supabase.auth.signInWithOAuth({ provider: "google" });

  const loginFacebook = () =>
    supabase.auth.signInWithOAuth({ provider: "facebook" });

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  /* =======================
     VEICOLI
  ======================= */
  useEffect(() => {
    if (!user) return;

    supabase
      .from("veicoli")
      .select("*")
      .eq("utente_id", user.id)
      .order("principale", { ascending: false })
      .then(({ data }) => {
        if (data) {
          setVeicoli(data);
          const principale = data.find(v => v.principale);
          if (principale) setVeicoloAttivo(principale.id);
        }
      });
  }, [user]);

  /* =======================
     GPS
  ======================= */
  const rilevaGPS = () => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        setPosizione(pos);
        setErroreGPS(null);
      },
      err => setErroreGPS(err.message),
      { enableHighAccuracy: true }
    );
  };

  /* =======================
     LOGIN
  ======================= */
  if (!user) {
    return (
      <div style={styles.login}>
        <h1>CareAutoPro</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={loginEmailPassword}>Accedi</button>

        {erroreLogin && <p style={{ color: "red" }}>{erroreLogin}</p>}

        <hr style={{ width: "100%" }} />

        <button onClick={loginGoogle}>Accedi con Google</button>
        <button onClick={loginFacebook}>Accedi con Facebook</button>
      </div>
    );
  }

  /* =======================
     UI
  ======================= */
  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h2>CareAutoPro</h2>
        <button onClick={logout}>Logout</button>
      </header>

      <nav style={styles.nav}>
        <button onClick={() => setPagina("dashboard")}>Dashboard</button>
        <button onClick={() => setPagina("veicoli")}>Veicoli</button>
        <button onClick={() => setPagina("tracking")}>Tracciamento</button>
        <button onClick={() => setPagina("impostazioni")}>Impostazioni</button>
      </nav>

      <main style={styles.main}>
        {pagina === "dashboard" && (
          <>
            <h3>Dashboard</h3>
            <p>
              Veicolo attivo:{" "}
              {veicoli.find(v => v.id === veicoloAttivo)?.nomeveicolo || "N/D"}
            </p>
            <p>Modalità: {modalita}</p>
          </>
        )}

        {pagina === "veicoli" && (
          <>
            <h3>I tuoi veicoli</h3>
            <select
              value={veicoloAttivo ?? ""}
              onChange={e => setVeicoloAttivo(Number(e.target.value))}
            >
              <option value="">Seleziona veicolo</option>
              {veicoli.map(v => (
                <option key={v.id} value={v.id}>
                  {v.nomeveicolo} {v.principale ? "(principale)" : ""}
                </option>
              ))}
            </select>
          </>
        )}

        {pagina === "tracking" && (
          <>
            <h3>Tracciamento</h3>

            <label>
              <input
                type="radio"
                checked={modalita === "manuale"}
                onChange={() => setModalita("manuale")}
              />
              Manuale
            </label>

            <label style={{ marginLeft: 10 }}>
              <input
                type="radio"
                checked={modalita === "automatico"}
                onChange={() => setModalita("automatico")}
              />
              Automatico
            </label>

            <br /><br />

            <button onClick={rilevaGPS}>Rileva posizione</button>

            {posizione && (
              <p>
                Lat: {posizione.coords.latitude}<br />
                Lng: {posizione.coords.longitude}
              </p>
            )}

            {erroreGPS && <p style={{ color: "red" }}>{erroreGPS}</p>}
          </>
        )}

        {pagina === "impostazioni" && (
          <>
            <h3>Impostazioni</h3>
            <p>Email: {user.email}</p>
          </>
        )}
      </main>
    </div>
  );
}

/* =======================
   STILI
======================= */
const styles: any = {
  app: { fontFamily: "sans-serif" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    background: "#1e293b",
    color: "white"
  },
  nav: {
    display: "flex",
    justifyContent: "space-around",
    padding: 10,
    background: "#e5e7eb"
  },
  main: { padding: 20 },
  login: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    height: "100vh"
  }
};

/* =======================
   BOOTSTRAP
======================= */
ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
