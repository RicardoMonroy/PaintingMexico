import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react(),
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
    ],
    build: {
        rollupOptions: {
            external: ['react-quill/dist/quill.snow.css']
        }
    },
    server: {
        hmr: {
            host: 'localhost',
        },
    },
});
