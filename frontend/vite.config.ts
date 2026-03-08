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
        theme_color: '#575DFB',
        background_color: '#F8F9FF',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ],
        categories: ['utilities', 'navigation', 'accessibility']
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.accessmap\.app\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'api-cache' }
          },
          {
            urlPattern: /^https:\/\/tile\.openstreetmap\.org\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'osm-tiles', expiration: { maxAgeSeconds: 7 * 24 * 60 * 60 } }
          }
        ]
      }
    })
  ],
  server: {
    port: 3000,
    proxy: {
      '/api/auth': { target: 'http://localhost:8080', changeOrigin: true },
      '/api/reports': { target: 'http://localhost:8082', changeOrigin: true },
      '/api/map': { target: 'http://localhost:8083', changeOrigin: true },
      '/api/users': { target: 'http://localhost:8081', changeOrigin: true },
      '/api/notifications': { target: 'http://localhost:8084', changeOrigin: true }
    }
  }
})
