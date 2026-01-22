import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
    plugins: [react()],
    base: command === 'build' ? '/Grok-Imagine-AI-Vault/' : '/',
    server: {
        port: 5173,
        strictPort: true,
    }
}))
