#!/usr/bin/env bash
set -e

echo "☢️ CAREAUTOPRO – FORCE VISIBLE APP"

# main.jsx
mkdir -p src
cat <<'JSX' > src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
JSX

# App.jsx
cat <<'JSX' > src/App.jsx
export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
      fontWeight: "bold",
      background: "#111",
      color: "#00ff99"
    }}>
      ✅ CAREAUTOPRO – APP TEST OK
    </div>
  );
}
JSX

# index.css minimo
cat <<'CSS' > src/index.css
html, body, #root {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
CSS

# build pulita
rm -rf dist node_modules/.vite
npm install
npm run build

# commit & push
git add .
git commit -m "test: force visible app (debug white screen)" || true
git push origin main || true

echo ""
echo "✅ APP DI TEST PUBBLICATA"
echo "📱 ORA:"
echo "1) Cancella DATI SITO dal browser"
echo "2) Riapri https://careautopro.vercel.app"
