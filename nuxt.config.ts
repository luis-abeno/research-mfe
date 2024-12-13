// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/eslint'],
  eslint: {
    config: {
      standalone: false,
    },
  },

  app: {
    head: {
      title: 'Projeto de pesquisa TCC - MFEs',
    },
  },

  runtimeConfig: {
    public: {
      apiUrl: '',
    },
  },
})
