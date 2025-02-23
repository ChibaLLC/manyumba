// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },
	modules: ["reka-ui/nuxt", "shadcn-nuxt", "@nuxt/fonts", "@nuxt/icon"],
	future: {
		compatibilityVersion: 4,
	},
	extends: ["github:kgarchie/nuxt-starter#1"],
	nitro: {
		imports: {
			dirs: ["./shared/utils", "./shared/types"],
		},
	},
	imports: {
		dirs: ["../shared/types", "../shared/utils"],
	},
	shadcn: {
		/**
		 * Directory that the component lives in.
		 * @default "./components/ui"
		 */
		componentDir: "./app/components/ui",
	},
	icon: {
		size: '24px',
		customCollections: [
			{
				dir: "./app/assets/icons",
				prefix: "local",
			},
		],
	},
});
