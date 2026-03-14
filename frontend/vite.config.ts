import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'AccessMap — Accessibilité Urbaine',
        short_name: 'AccessMap',
        description: 'Cartographiez et signalez les obstacles d\'accessibilité urbaine',
        theme_color: '#4B55E8',
        background_color: '#07071A',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: []
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg}']
      }
    })
  ],
  server: {
    port: 3000,
    proxy: {
      '/api/auth':          { target: 'http://localhost:8080', changeOrigin: true },
      '/api/reports':       { target: 'http://localhost:8082', changeOrigin: true },
      '/api/map':           { target: 'http://localhost:8083', changeOrigin: true },
      '/api/users':         { target: 'http://localhost:8081', changeOrigin: true },
      '/api/notifications': { target: 'http://localhost:8084', changeOrigin: true }
    }
  }
})
