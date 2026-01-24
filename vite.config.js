import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { networkInterfaces } from 'os';

const getLocalIP = () => {
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return '0.0.0.0';
};

const localIP = getLocalIP();

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
    plugins: [react()],
    base: './',
    server: {
        port: 5179,
        strictPort: true,
        host: '0.0.0.0',
        hmr: {
            host: localIP,
            port: 5179,
            protocol: 'ws'
        }
    }
}))
