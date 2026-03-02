// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt'],

  css: ['~/assets/css/terminal.css'],

  runtimeConfig: {
    public: {
      umamiWebsiteId: '',
      umamiUrl: '',
    },
  },

  app: {
    head: {
      title: '</alialacal>',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Interactive terminal-style portfolio of Ali Alaca' },
      ],
      script: [
        ...(process.env.NUXT_PUBLIC_UMAMI_URL && process.env.NUXT_PUBLIC_UMAMI_WEBSITE_ID
          ? [{
              src: `${process.env.NUXT_PUBLIC_UMAMI_URL}/script.js`,
              async: true,
              'data-website-id': process.env.NUXT_PUBLIC_UMAMI_WEBSITE_ID,
            }]
          : []),
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap',
        },
      ],
    },
  },

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },
})
