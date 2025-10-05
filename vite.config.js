import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'CareAutoPro',
        short_name: 'CareAutoPro',
        description: 'Gestione veicoli e manutenzioni con tracking GPS',
        theme_color: '#2563eb',
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
      },
      workbox: {
        // Configurazione per app mobile
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/pagead2\.googlesyndication\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'ads-cache'
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 3000
  },
  build: {
    // Configurazione per AdSense compatibilità
    target: 'es2015'
  }
})
