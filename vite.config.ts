import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/wc': {
          target: 'https://billardramirez.cl',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/wc/, '/demosle/wp-json/wc/v3'),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // Agregar autenticación básica con las credenciales del .env
              const consumerKey = env.VITE_WOO_CONSUMER_KEY || '';
              const consumerSecret = env.VITE_WOO_CONSUMER_SECRET || '';
              const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
              proxyReq.setHeader('Authorization', `Basic ${auth}`);

              // Debug log (optional - comentar en producción)
              console.log('Proxy request to:', proxyReq.path);
            });
          },
        },
        // Proxy para los endpoints PHP de Paiku
        '/api/paiku': {
          target: 'http://localhost:8080', // Servidor PHP local
          changeOrigin: true,
          rewrite: (path) => path,
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('Paiku proxy request to:', proxyReq.path);
            });
            proxy.on('error', (err, req, res) => {
              console.error('Paiku proxy error:', err);
            });
          },
        },
        // Proxy para endpoints REST API personalizados
        '/wp-json/billard': {
          target: 'https://billardramirez.cl/demosle',
          changeOrigin: true,
          secure: false,
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('Billard API proxy request to:', proxyReq.path);
            });
          },
        },
      },
    },
  };
})
