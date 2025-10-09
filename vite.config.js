import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// Rimuovi temporaneamente VitePWA per testare

export default defineConfig({
  plugins: [
    react(),
    // Commenta VitePWA temporaneamente per debug
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   manifest: {
    //     name: 'CareAutoPro',
    //     short_name: 'CareAutoPro',
    //     description: 'Gestione veicoli e manutenzioni',
    //     theme_color: '#ffffff',
    //     icons: [
    //       {
    //         src: '/icon-192.png',
    //         sizes: '192x192',
    //         type: 'image/png'
    //       },
    //       {
    //         src: '/icon-512.png',
    //         sizes: '512x512',
    //         type: 'image/png'
    //       }
    //     ]
    //   }
    // })
  ],
  server: {
    port: 3000,
    host: true // Aggiungi questa riga
  },
  preview: {
    port: 3000,
    host: true
  }
})
