import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Custom plugin to handle chrome.js antivirus false positive
const chromeStubPlugin = () => {
  return {
    name: 'chrome-stub-plugin',
    resolveId(id: string, importer?: string) {
      if (id.includes('chrome.js') && importer?.includes('lucide-react')) {
        return path.resolve(__dirname, './src/lib/chrome-stub.ts');
      }
      return null;
    }
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), chromeStubPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "cookie": path.resolve(__dirname, "./src/lib/cookie-mock.ts"),
      "set-cookie-parser": path.resolve(__dirname, "./src/lib/cookie-mock.ts")
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react/dist/esm/icons/chrome.js']
  },
  define: {
    global: 'globalThis',
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
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
