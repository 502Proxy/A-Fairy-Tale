// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths'; // Importiere das Plugin

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(), // Füge das Plugin hinzu
  ],
  test: {
    globals: true, // Globale APIs wie describe, it, expect verfügbar machen (ähnlich Jest)
    environment: 'jsdom', // DOM-Umgebung für React Testing Library simulieren
    setupFiles: './setupTests.ts', // Pfad zur Setup-Datei (siehe nächster Schritt)
    // Optional: Include-Pattern für Testdateien (Standard ist gut)
    // include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    // Optional: Coverage-Konfiguration
    // coverage: {
    //   provider: 'v8', // oder 'istanbul'
    //   reporter: ['text', 'json', 'html'],
    // },
  },
});
