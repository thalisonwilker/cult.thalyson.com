import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://cult.thalyson.com',
  output: 'static',
  build: {
    format: 'directory'
  }
});
