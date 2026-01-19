import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
//  base: process.env.VITE_BASE_PATH || '/ProyectoFinalMedical',
export default defineConfig({
  plugins: [react()],
})
