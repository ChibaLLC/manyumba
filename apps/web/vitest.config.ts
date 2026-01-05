import { defineVitestConfig } from "@nuxt/test-utils/config";

const vitestExclusions = ["./node_modules/**", "./dist/**", "./.nuxt/**", "logs", "node_modules"] as const;
export default defineVitestConfig({
  test: {
    setupFiles: ["../vitest.setup.ts"],
    environment: "nuxt",
    environmentOptions: {
      nuxt: {
        mock: {
          indexedDb: true,
          intersectionObserver: true,
        },
        overrides: {
          vite: {
            define: {
              "import.meta.test": "true",
            },
          },
        },
      },
    },
    exclude: vitestExclusions as unknown as string[],
    coverage: {
      exclude: vitestExclusions as unknown as string[],
    },
    testTimeout: 50000,
  },
});
