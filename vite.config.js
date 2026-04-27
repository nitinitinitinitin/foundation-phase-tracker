import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Replace 'foundation-phase-tracker' with your actual GitHub repo name
export default defineConfig({
  plugins: [react()],
  base: '/foundation-phase-tracker.git/',
})