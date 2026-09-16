import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        services: resolve(import.meta.dirname, "services.html"),
        method: resolve(import.meta.dirname, "method.html"),
        about: resolve(import.meta.dirname, "about.html"),
        community: resolve(import.meta.dirname, "community.html"),
        contact: resolve(import.meta.dirname, "contact.html"),
      },
    },
  },
});
