import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

// https://vite.dev/config/
export default ({ mode }) => {
  // Загружаем переменные окружения из .env
  const env = loadEnv(mode, process.cwd())

  return defineConfig({
    plugins: [
      vue({
        template: { transformAssetUrls }
      }),
      vueDevTools(),
      quasar({
        sassVariables: fileURLToPath(
          new URL('./src/quasar-variables.sass', import.meta.url)
        )
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "./src/quasar-variables.sass";
          `,
        }
      }
    },
    server: {
      proxy: {
        '/dev': {
          target: 'http://localhost:5000', // Ваш Flask-сервер
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/dev/, ''), // Удаляет префикс "/dev"
        },
        '/dadata': {
          target: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/dadata/, '/suggest/address'),
          headers: {
            'Authorization': `Token ${env.VITE_DADATA_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
  })
}
