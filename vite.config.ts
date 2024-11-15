import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://www.sreality.cz',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Removes the initial '/api'
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@globals": resolve(__dirname, "src/globals"),
      "@pages": resolve(__dirname, "src/pages"),
    },
  },
})
