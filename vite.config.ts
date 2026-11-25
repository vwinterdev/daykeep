import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      strategies: 'generateSW',
      filename: 'sw.js',
      registerType: 'prompt',
      manifest: false, // Манифест остаётся в public/manifest.webmanifest.
      includeAssets: ['icons/*', 'manifest.webmanifest'],
      workbox: {
        globPatterns: ['**/*.{js,css,html}', 'locales/**/*.json'],
        navigateFallback: '/index.html',
        navigateFallbackAllowlist: [/^\/(?:index\.html)?$/],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: false,
      },
    }),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
})
