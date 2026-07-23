import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import glsl from "vite-plugin-glsl";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    glsl(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      // date-fns v3 lists a non-existent index.mjs — force the CJS entry
      "date-fns": path.resolve(__dirname, "node_modules/date-fns/index.js"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core 3D engine - keep together for better performance
          'three-core': ['three'],
          'three-fiber': ['@react-three/fiber'],
          'three-drei': ['@react-three/drei'],
          'three-postprocessing': ['@react-three/postprocessing', 'postprocessing'],

          // UI components - Radix Dialog/Select/Tabs are statically imported only in ui/ wrappers
          'ui-core': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs'],

          // Utilities and smaller deps
          'utils': ['axios', 'zustand', 'zod', 'clsx', 'date-fns']
        },
        // Optimize chunk naming for caching
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
      external: [
        // Mark heavy AI/ML dependencies as external - loaded from database
        '@xenova/transformers',
        'onnxruntime-web',
        'onnxruntime-node',
        '@mediapipe/tasks-vision'
      ],
      // Aggressive tree shaking
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false
      }
    },
    // Additional size optimizations
    lib: undefined, // Remove library mode optimizations that increase size
    // Advanced optimizations
    cssCodeSplit: true,
    reportCompressedSize: false // Faster builds
  },
  assetsInclude: ["**/*.gltf", "**/*.glb", "**/*.mp3", "**/*.ogg", "**/*.wav"],
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      port: 5173,
      host: '0.0.0.0',
      clientPort: 443
    }
  }
});