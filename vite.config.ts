import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import ViteBabel from 'vite-plugin-babel';
import path from 'path';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // console.log(env, 'env')
  return {
    base: env.VITE_BASE_URL,
    plugins: [
      react(),
      ViteBabel()
    ],
    define: {
      'process.env': {},
    },
    resolve: {
      extensions: ['.ts', '.js', '.jsx', '.tsx', '.scss'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '~@': path.resolve(__dirname, 'src'),
      },
      allowImportingTsExtensions: true,
    },
    server: {
      host: '0.0.0.0',
      port: 3006,
      cors: true,
      proxy: {
        '/todoapi': {
          target: env.VITE_URL,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/todoapi/, '')
        }
      }
    },
    build: {
      outDir: env.OUT_DIR
    }
  }
})
