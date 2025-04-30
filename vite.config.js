import { defineConfig } from "vite";
import webExtension from "vite-plugin-web-extension";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    webExtension({
      manifest: "src/manifest.json",
      watchFilePaths: ["src/**/*"], // Watch for changes in the src directory
      browser: null, // Default to chrome, can be set via env var TARGET=firefox
      disableAutoLaunch: true, // Add this line to disable auto-opening
    }),
  ],
});
