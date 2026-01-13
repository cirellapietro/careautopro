import { createClient } from "@supabase/supabase-js";

/* ================== CONFIG ================== */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  document.body.innerHTML = "Supabase non configurato";
  throw new Error("Missing env");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/* ================== INIT ================== */
document.addEventListener("DOMContentLoaded", async () => {
  const { data } = await supabase.auth.getSession();
  data.session ? renderHome() : renderLogin();
});

/* ================== LAYOUT ================== */
function renderLayout(content: string, showMenu = false) {
  document.body.innerHTML = `
  <style>
    :root {
      --bg: #f8fafc;
      --text: #0f172a;
      --card: #ffffff;
      --primary: #2563eb;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #0f172a;
        --text: #e5e7eb;
        --card: #1e293b;
        --primary: #60a5fa;
      }
    }

    * { box-sizing: border-box; font-family: system-ui; }
    body { margin: 0; background: var(--bg); color: var(--text); }

    .container {
      padding: 20px;
      max-width: 420px;
      margin: auto;
    }

    h1, h2 { text-align: center; }

    input, button {
      width: 100%;
      padding: 12px;
      margin-top: 10px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
    }

    button {
      background: var(--primary);
      color: white;
      border: none;
      font-size: 16px;
    }

    .link {
      text-align: center;
      margin-top: 12px;
      color: var(--primary);
      cursor: pointer;
    }

    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--card);
      border-top: 1px solid #cbd5e1;
      display: flex;
    }

    .bottom-nav button {
      flex: 1;
      border-radius: 0;
      background: none;
      color: var(--text);
    }

    .spacer { height: 70px; }
  </style>

  <div class="container">
    ${content}
    <div class="spacer"></div>
  </div>

  ${showMenu ? `
  <nav class="bottom-nav">
    <button onclick="renderHome()">Home</button>
    <button onclick="logout()">Logout</button>
  </nav>` : ``}
  `;
}

/* ================== LOGIN ================== */
function renderLogin() {
  renderLayout(`
    <h1>CareAutoPro</h1>

    <input id="email" placeholder="Email">
    <input id="password" type="password" placeholder="Password">
    <button onclick="login()">Accedi</button>

    <button onclick="social('google')">Accedi con Google</button>
    <button onclick="social('facebook')">Accedi con Facebook</button>

    <div class="link" onclick="renderRegister()">Registrati</div>
  `);
}

async function login() {
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement).value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);

  renderHome();
}

/* ================== REGISTER ================== */
function renderRegister() {
  renderLayout(`
    <h2>Registrazione</h2>

    <input id="email" placeholder="Email">
    <input id="password" type="password" placeholder="Password">
    <button onclick="register()">Crea account</button>

    <div class="link" onclick="renderLogin()">Torna al login</div>
  `);
}

async function register() {
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement).value;

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return alert(error.message);

  alert("Registrazione completata. Controlla la mail.");
  renderLogin();
}

/* ================== SOCIAL ================== */
async function social(provider: "google" | "facebook") {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: window.location.origin }
  });
  if (error) alert(error.message);
}

/* ================== HOME ================== */
function renderHome() {
  renderLayout(`
    <h2>Benvenuto</h2>
    <p>Accesso effettuato correttamente.</p>
    <p>Modulo veicoli in preparazione.</p>
  `, true);
}

/* ================== LOGOUT ================== */
async function logout() {
  await supabase.auth.signOut();
  renderLogin();
}
