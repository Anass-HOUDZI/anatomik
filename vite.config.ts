import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      // Security headers for development
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      // Content Security Policy for development
      'Content-Security-Policy': mode === 'development' 
        ? "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: ws://localhost:* ws://127.0.0.1:* http://localhost:* http://127.0.0.1:*; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https://api.nal.usda.gov https://world.openfoodfacts.org https://trackapi.nutritionix.com wss://localhost:* ws://localhost:* ws://127.0.0.1:* http://localhost:* http://127.0.0.1:*;"
        : "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https://api.nal.usda.gov https://world.openfoodfacts.org https://trackapi.nutritionix.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Security and performance optimizations
    minify: 'terser',
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true,
        pure_funcs: mode === 'production' ? ['console.log', 'console.warn'] : [],
        reduce_vars: true,
        unused: true,
        conditionals: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        // Prevent information leakage in production builds
        generatedCode: {
          symbols: false
        },
        // Optimize chunk splitting for better caching
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-select'],
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
        },
      },
      // Tree shaking optimizations
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },
    // Compression and optimization
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
    exclude: ['@vite/client', '@vite/env'],
  },
}));
