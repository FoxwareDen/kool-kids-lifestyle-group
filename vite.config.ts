/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

export default defineConfig({
  resolve: { tsconfigPaths: true },

  // 1. Force Vite to tree-shake lucide-react during SSR instead of loading the entire index module
  ssr: {
    noExternal: ['lucide-react'],
  },

  // 2. Break down monolithic client bundles into isolated chunks
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons'
          }
          if (id.includes('node_modules/@tanstack')) {
            return 'vendor-tanstack'
          }
        },
      },
    },
  },

  plugins: [
    devtools(),
    nitro({
      rollupConfig: {
        external: [/^@sentry\//],
      },
    }),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
        filter: (page) => {
          // 1. Strip query parameters (e.g. ?lang=en)
          if (page.path.includes('?')) return false

          // 2. Exclude private routes and test pages
          if (
            page.path.startsWith('/dashboard') ||
            page.path.startsWith('/login') ||
            page.path.includes('test-page')
          ) {
            return false
          }

          // 3. Prevent duplicate trailing slashes
          if (page.path.length > 1 && page.path.endsWith('/')) return false

          return true
        },
      },
      sitemap: {
        enabled: true,
        host: 'https://360experiences.co.za',
      },
    }),
    viteReact(),
  ],
  test: {
    environment: 'jsdom',
  },
})
