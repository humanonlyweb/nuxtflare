export default defineNuxtConfig({
  compatibilityDate: "latest",
  future: { compatibilityVersion: 5 },
  devtools: { enabled: true },
  experimental: {
    viteEnvironmentApi: true,
    typescriptPlugin: true,
    nitroAutoImports: true,
    typedPages: true,
  },
  modules: ["@nuxt/fonts", "@comark/nuxt", "@vueuse/nuxt", "evlog/nuxt", "nuxt-auth-utils"],

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
      htmlAttrs: {
        lang: "en",
        translate: "no",
      },
      meta: [{ name: "google", content: "notranslate" }],
    },
  },
  css: ["~/assets/styles/app.css"],
  runtimeConfig: {
    email: {
      fromName: "HumanOnlyWeb",
      fromAddress: "contact@humanonlyweb.com",
    },
    public: {
      siteUrl: "",
    },
  },
  nitro: {
    preset: "cloudflare-module",
    experimental: { tasks: true },
    tasks: {
      "notes:prune": {
        handler: "#server/features/notes/notes.task",
        description: "Delete notes older than the retention window",
      },
    },
    scheduledTasks: {
      "0 3 * * *": ["notes:prune"],
    },
    typescript: {
      tsConfig: {
        compilerOptions: {
          types: ["@cloudflare/workers-types"],
        },
        exclude: ["**/*.test.ts"],
      },
    },
  },

  // Modules config
  fonts: {
    processCSSVariables: true,
    defaults: {
      weights: ["400", "600", "700", "800"],
    },
  },
  evlog: {
    env: {
      service: "template",
    },
  },
});
