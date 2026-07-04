import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages のプロジェクトページはサブパス配信のため base を固定する。
// https://yukikanedomi.github.io/rotordynamics-roadmap/
export default defineConfig({
  base: '/rotordynamics-roadmap/',
  plugins: [react()],
})
