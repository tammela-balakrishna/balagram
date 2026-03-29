import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: '/static/',
  plugins: [
    tailwindcss(),
  ],
  build: {
    outDir: path.resolve(__dirname, '../instagram/frontend_dist'),
    emptyOutDir: true,
  },
})
