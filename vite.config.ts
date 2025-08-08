// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // ✅ VERY IMPORTANT for Netlify!
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
