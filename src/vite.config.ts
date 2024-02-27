import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    assetsInclude: ['/sb-preview/runtime.js'],
    plugins: [
        eslint({
            exclude: ['/virtual:/**', 'node_modules/**', '/sb-preview/**'],
        }),
    ],
    build: { outDir: './dist', emptyOutDir: true },
    base: './',
    resolve: {
        alias: {
            '@processed-assets': path.resolve(__dirname, './processed-assets'),
        },
    },
});
