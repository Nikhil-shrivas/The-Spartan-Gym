import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  
  // USER PROVIDED CREDENTIALS - FORCED FALLBACK
  const sUrl = env.VITE_SUPABASE_URL || 'https://fhvmjcopbwxujmzescik.supabase.co';
  const sKey = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZodm1qY29wYnd4dWptemVzY2lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NjQwMTQsImV4cCI6MjA5MjI0MDAxNH0.VmNH66NTUJNTRq7aqoivo1eFvogcX2ksm-1tG4PBs8s';

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(sUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(sKey),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
