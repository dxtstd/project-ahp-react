import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  // Source - https://stackoverflow.com/a/79377387
// Posted by ansmonjol, modified by community. See post 'Timeline' for change history
// Retrieved 2026-03-24, License - CC BY-SA 4.0

server: {
  allowedHosts: true
},
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss()
  ],
})
