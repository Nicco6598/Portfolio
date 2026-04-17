import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), cloudflare()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/framer-motion')) {
            return 'motion'
          }

          if (id.includes('node_modules/gsap')) {
            return 'gsap'
          }

          if (id.includes('node_modules/react-router-dom')) {
            return 'router'
          }

          if (id.includes('node_modules/lenis')) {
            return 'lenis'
          }
        },
      },
    },
  },
})