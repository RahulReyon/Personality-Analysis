
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // You can change the port if needed
  },
  resolve: {
    alias: {
      '@': '/src', // Optional: helps with cleaner imports
    },
  },
});
