# Crea il file setup-vite.py
cat > setup_vite.py << 'EOF'
#!/usr/bin/env python3
import os
import json

def create_file(path, content):
    """Crea un file con il contenuto specificato"""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✅ Creato: {path}")

def main():
    print("🚀 Setup migrazione a Vite...")
    
    # 1. vite.config.js
    create_file('vite.config.js', '''import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'CareAutoPro',
        short_name: 'CareAutoPro',
        description: 'Gestione veicoli e manutenzioni',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    port: 3000
  }
})''')

    # 2. index.html
    create_file('index.html', '''<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CareAutoPro</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>''')

    # 3. main.jsx (se non esiste)
    if not os.path.exists('src/main.jsx'):
        create_file('src/main.jsx', '''import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)''')

    # 4. vercel.json
    create_file('vercel.json', json.dumps({
        "builds": [
            {
                "src": "package.json",
                "use": "@vercel/static-build"
            }
        ],
        "routes": [
            {
                "src": "/(.*)",
                "dest": "/index.html"
            }
        ]
    }, indent=2))

    # 5. Icone PWA (placeholder)
    create_file('public/icon-192.png', '# Placeholder - sostituire con icona reale')
    create_file('public/icon-512.png', '# Placeholder - sostituire con icona reale')
    
    # 6. Aggiorna package.json
    if os.path.exists('package.json'):
        with open('package.json', 'r', encoding='utf-8') as f:
            pkg = json.load(f)
        
        # Aggiorna scripts
        pkg['scripts'] = {
            "dev": "vite",
            "build": "vite build", 
            "preview": "vite preview",
            "predeploy": "vite build"
        }
        
        # Aggiorna dependencies
        if 'devDependencies' not in pkg:
            pkg['devDependencies'] = {}
        
        pkg['devDependencies'].update({
            "@vitejs/plugin-react": "^4.1.0",
            "vite": "^4.4.0",
            "vite-plugin-pwa": "^0.16.0"
        })
        
        with open('package.json', 'w', encoding='utf-8') as f:
            json.dump(pkg, f, indent=2)
        
        print("✅ Aggiornato: package.json")
    
    print("\\\\n🎉 Setup completato!")
    print("\\\\n📋 Prossimi passi:")
    print("1. npm install")
    print("2. npm run dev")
    print("3. Commit e push su GitHub")

if __name__ == "__main__":
    main()
EOF
