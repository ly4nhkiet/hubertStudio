import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  build: {
    assets: 'css',
    format: 'file',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: 'entry.[hash].js',
        chunkFileNames: 'chunks/chunk.[hash].js',
        assetFileNames: 'css/index.css',
      },
    },
  }
});
