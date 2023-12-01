/**
 * @file vite config
 * @module vite.config
 */

import path from 'path'
import { loadEnv, defineConfig } from 'vite'
import vuePlugin from '@vitejs/plugin-vue'
import UnheadVite from '@unhead/addons/vite'
import packageJSON from './package.json'

const CWD = process.cwd()
const BASE_ENV_CONFIG = loadEnv('', CWD)

// https://vitejs.dev/config/#conditional-config
export default defineConfig(({ command, mode }) => {
  const TARGET_ENV_CONFIG = loadEnv(mode, CWD)
  console.info('vite config', {
    command,
    mode,
    TARGET_ENV_CONFIG
  })

  return {
    plugins: [vuePlugin(), UnheadVite()],
    root: path.resolve(__dirname),
    publicDir: 'public',
    resolve: {
      alias: {
        '/@': path.resolve(__dirname, 'src')
      }
    },
    define: {
      __APP_VERSION__: JSON.stringify(packageJSON.version)
    },
    experimental: {
      // CDN urls have more layers of subdirectories that need to be added at build time
      // https://vitejs.dev/guide/build.html#advanced-base-options
      renderBuiltUrl(filename: string, { hostType, type }) {
        if (type === 'public' && hostType === 'css') {
          return '/assets/' + filename
        } else {
          return '/' + filename
        }
      }
    },
    server: {
      open: true,
      port: 3000,
      proxy: {
        [BASE_ENV_CONFIG.VITE_API_PROXY_URL]: {
          target: BASE_ENV_CONFIG.VITE_API_ONLINE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          charset: false,
          additionalData: `$source-url: '${TARGET_ENV_CONFIG.VITE_FE_URL}';`
        }
      }
    },
    build: {
      sourcemap: true,
      manifest: true,
      rollupOptions: {
      }
    }
  }
})
