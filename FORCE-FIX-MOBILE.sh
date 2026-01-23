#!/usr/bin/env bash
set -e

echo "🚑 CAREAUTOPRO – FORCE MOBILE FIX"

CSS_PATH="src/index.css"
HTML_PATH="index.html"

echo "▶ Sovrascrivo index.css"
cat <<'CSS' > $CSS_PATH
@tailwind base;
@tailwind components;
@tailwind utilities;

/* RESET */
* { box-sizing: border-box; }
html, body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  background: #f9fafb;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

/* SAFE AREA */
body {
  padding-bottom: calc(72px + env(safe-area-inset-bottom));
}

/* BOTTOM NAV */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  height: 72px;
  padding-bottom: env(safe-area-inset-bottom);

  background: #ffffff;
  border-top: 1px solid #e5e7eb;

  display: flex;
  justify-content: space-around;
  align-items: center;

  z-index: 9999;
}

.bottom-nav a,
.bottom-nav button {
  flex: 1;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  font-size: 13px;
  font-weight: 500;
  color: #374151;
  text-decoration: none;
  background: none;
  border: none;
}

.bottom-nav svg,
.bottom-nav img {
  width: 26px;
  height: 26px;
  margin-bottom: 4px;
}

.bottom-nav a.active {
  color: #2563eb;
}

/* MOBILE FIRST */
@media (max-width: 768px) {
  .bottom-nav {
    height: 80px;
  }

  .bottom-nav a,
  .bottom-nav button {
    font-size: 14px;
  }

  .bottom-nav svg,
  .bottom-nav img {
    width: 28px;
    height: 28px;
  }
}
CSS

echo "▶ Forzo invalidazione cache (index.html)"
if grep -q "careautopro-build" $HTML_PATH; then
  sed -i "s/careautopro-build=.*/careautopro-build=$(date +%s)/" $HTML_PATH
else
  sed -i "s|</head>|<meta name=\"careautopro-build\" content=\"$(date +%s)\"></head>|" $HTML_PATH
fi

echo "▶ Commit + rebuild forzato"
git add src/index.css index.html
git commit -m "fix: FORCE mobile bottom nav + cache bust" || true
git push origin main || true

echo ""
echo "✅ FATTO"
echo "📱 ORA:"
echo "1. Chiudi COMPLETAMENTE il browser sul telefono"
echo "2. Riapri"
echo "3. Vai su https://careautopro.vercel.app"
