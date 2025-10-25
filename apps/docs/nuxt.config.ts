// https://nuxt.com/docs/api/configuration/nuxt-config
const ignoredComponents = ["ui", "__tests__", "*.test.*", "*.spec.*", "*.utils.*", "*.json"] as const;
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxt/content", "motion-v/nuxt", "@nuxt/image", "nuxt-og-image"],
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  css: ["~/assets/css/tailwind.css"],
  compatibilityDate: "2024-04-03",
  content: {
    preview: {
      api: "https://api.nuxt.studio",
      gitInfo: {
        name: "manyumba-docs",
        owner: "PrimalDjinn",
        url: "https://github.com/ChibaLLC/manyumba",
      },
    },
    experimental: {
      sqliteConnector: "native",
    },
  },
  mdc: {
    highlight: {
      theme: {
        dark: "github-dark",
        default: "github-dark",
        light: "github-light",
      },
    },
  },
  app: {
    head: {
      // link: [{ rel: "icon", type: "image/svg+xml", href: "/finueva.svg" }],
    },
  },
  icon: {
    size: "24px",
    customCollections: [
      {
        dir: "app/assets/icons",
        prefix: "local",
      },
    ],
    class: "icon",
    mode: "svg",
  },
  runtimeConfig: {
    public: {
      version: "0.0.0",
    },
  },
  site: {
    url: "https://manyumba.sutit.org",
    name: "Manyumba",
  },
  $development: {
    site: {
      url: "http://localhost:4000",
      name: "Developing Awesome Website",
    },
  },
  devServer: {
    port: 4000,
  },
  pages: {
    pattern: ["**/*.vue", "!**/components/**", "!**/_views/**"],
  },
  components: {
    dirs: [
      {
        path: "pages",
        pattern: ["**/components/**", "**/_views/**"],
        pathPrefix: false,
        ignore: ignoredComponents as unknown as string[],
      },
      {
        path: "components",
        ignore: ignoredComponents as unknown as string[],
        pathPrefix: false,
      },
    ],
  },
});
