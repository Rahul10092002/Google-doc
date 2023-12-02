import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  jsx: "false", // Disable JSX parsing
  plugins: [react()],
});
