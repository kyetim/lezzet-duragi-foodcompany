import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "cookie": path.resolve(__dirname, "./src/lib/empty-module.js")
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: ['cookie']
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      external: ['cookie'],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react']
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.woff2')) {
            return 'assets/fonts/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})
