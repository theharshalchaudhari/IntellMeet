// @ts-check

import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

const supabaseUrl =
  process.env.PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  '';

const supabaseAnonKey =
  process.env.PUBLIC_SUPABASE_ANON_KEY ||
  process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  '';

/** @type {any} */
const tailwindPlugin = tailwindcss();

export default defineConfig({
  vite: {
    plugins: [tailwindPlugin],

    define: {
      __INTELLMEET_SUPABASE_URL__: JSON.stringify(supabaseUrl),
      __INTELLMEET_SUPABASE_ANON_KEY__: JSON.stringify(supabaseAnonKey),
    },
  },

  integrations: [react()],
});