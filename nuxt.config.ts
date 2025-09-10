import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config

const ignoredComponents = ["ui", "__tests__", "*.test.*", "*.spec.*", "*.utils.*", "*.json"] as const;
export default defineNuxtConfig({
  compatibilityDate: "2025-06-09",
  devtools: { enabled: true },
  modules: ["@nuxt/fonts", "@nuxt/icon", "@nuxtjs/i18n", "@nuxt/scripts", "@nuxt/image", "@nuxt/ui"],
  future: {
    compatibilityVersion: 4,
  },
  components: {
    dirs: [
      {
        path: "pages",
        pattern: "**/components/**",
        pathPrefix: false,
        ignore: ignoredComponents as unknown as string[],
      },
      {
        path: "components",
        ignore: ignoredComponents as unknown as string[],
      },
    ],
  },
  css: ["~/assets/css/tailwind.css", "~/assets/css/custom.scss"],
  extends: ["github:kgarchie/nuxt-starter#9"],
  nitro: {
    experimental: {
      websocket: true,
      asyncContext: true,
    },
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
    server: {
      allowedHosts: ["dev.chiba.llc", "localhost"],
    },
  },
  i18n: {
    defaultLocale: "en",
    bundle: {
      optimizeTranslationDirective: false,
    },
    locales: [{ code: "en", name: "English", file: "en.json" }],
    langDir: "../app/locales",
  },
  runtimeConfig: {
    public: {
      google: {
        maps: {
          key: "",
        },
      },
    },
  },
  ui: {
    colorMode: false,
  },
});
