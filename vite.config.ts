import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      babel: {
        plugins: [],
        babelrc: false,
        configFile: false,
      }
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: 'terser',
    // Increase this limit if you prefer fewer warnings
    chunkSizeWarningLimit: 1000, // in kB
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        // Enhanced chunking strategy
        manualChunks: (id) => {
          // Group React and ReactDOM in a single chunk
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          
          // Group UI framework libraries (adjust based on what you use)
          if (id.includes('node_modules/@mui') || 
              id.includes('node_modules/@emotion') ||
              id.includes('node_modules/styled-components')) {
            return 'ui-vendor';
          }
          
          // Group utilities and other common libraries
          if (id.includes('node_modules/lodash') || 
              id.includes('node_modules/date-fns') ||
              id.includes('node_modules/axios')) {
            return 'utils-vendor';
          }
          
          // Group all other node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode)
  }
}));