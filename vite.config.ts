import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "index.html"),
        options: resolve(__dirname, "options.html"),
        background: resolve(__dirname, "src/background/main.ts"),
        content: resolve(__dirname, "src/content/main.ts"),
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === "background") return "assets/background.js";
          if (chunk.name === "content") return "assets/contentScript.js";
          if (chunk.name === "popup") return "assets/popup.js";
          if (chunk.name === "options") return "assets/options.js";
          return "assets/[name].js";
        },
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
