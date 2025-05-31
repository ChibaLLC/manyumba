import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxt/fonts", "@nuxt/icon", "@nuxtjs/i18n"],
  future: {
    compatibilityVersion: 4,
  },
  components: {
    dirs: [
      {
        ignore: ["ui"],
      },
    ],
  },
  nitro: {
    experimental: {
      websocket: true,
    },
    imports: {
      dirs: ["./shared/utils", "./shared/types"],
    },
  },
  imports: {
    dirs: ["../shared/types", "../shared/utils"],
  },
  icon: {
    size: "24px",
    customCollections: [
      {
        dir: "./app/assets/icons",
        prefix: "local",
      },
    ],
    class: "icon",
    mode: "svg",
  },
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: "en",
    bundle: {
      optimizeTranslationDirective: false,
    },
    locales: [{ code: "en", name: "English", file: "en.json" }],
    langDir: "../app/locales",
  },
});
