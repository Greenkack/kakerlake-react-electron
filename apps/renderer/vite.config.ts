import { fileURLToPath } from 'url'
import { URL } from 'url'


// Zeile 1
import { defineConfig } from 'vite'
// Zeile 2
import react from '@vitejs/plugin-react'

// Zeile 4
// DEF Block — Vite-Server fest auf Port 5173 (für Electron + wait-on)
// - strictPort: true  => Vite nutzt exakt 5173 (kein Ausweichen).
// - host: 127.0.0.1   => lokal, stabil für wait-on und Firewalls.
// - preview: identisch, falls du Vite-Preview nutzt.
const rootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  root: rootDir,
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 5173,
    strictPort: true,
    host: '127.0.0.1',
    open: false
  },
  preview: {
    port: 5173,
    host: '127.0.0.1'
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true
  }
})
