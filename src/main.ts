import { createClient } from "@supabase/supabase-js";

// ================= CONFIG =================
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  document.body.innerHTML =
    "<h2>Supabase non configurato</h2><p>Verifica le variabili d'ambiente su Vercel</p>";
  throw new Error("Supabase env missing");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ================= INIT =================
document.addEventListener("DOMContentLoaded", async () => {
  const { data } = await supabase.auth.getSession();
  data.session ? renderHome() : renderLogin();
});

// ================= LOGIN =================
function renderLogin() {
  document.body.innerHTML = `
    <div class="container">
      <h1>CareAutoPro</h1>

      <input id="email" placeholder="Email" />
      <input id="password" type="password" placeholder="Password" />
      <button id="loginBtn">Accedi</button>

      <hr/>

      <button id="googleBtn">Accedi con Google</button>
      <button id="facebookBtn">Accedi con Facebook</button>
    </div>
  `;

  document.getElementById("loginBtn")!.onclick = loginEmail;
  document.getElementById("googleBtn")!.onclick = () =>
    socialLogin("google");
  document.getElementById("facebookBtn")!.onclick = () =>
    socialLogin("facebook");
}

async function loginEmail() {
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement).value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    alert(error.message);
    return;
  }
  renderHome();
}

async function socialLogin(provider: "google" | "facebook") {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: window.location.origin }
  });
  if (error) alert(error.message);
}

// ================= HOME =================
function renderHome() {
  document.body.innerHTML = `
    <div class="container">
      <h2>Benvenuto in CareAutoPro</h2>
      <p>Accesso effettuato correttamente.</p>
      <p>Modulo veicoli in caricamento...</p>
    </div>

    <nav class="bottom-nav">
      <button id="logoutBtn">Logout</button>
    </nav>
  `;

  document.getElementById("logoutBtn")!.onclick = logout;
}

// ================= LOGOUT =================
async function logout() {
  await supabase.auth.signOut();
  renderLogin();
}
