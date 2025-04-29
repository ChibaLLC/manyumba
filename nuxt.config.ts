import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },
	future: {
		compatibilityVersion: 4,
	},
	css: ["./app/assets/css/tailwind.css"],
	modules: ["@nuxt/eslint", "@nuxt/fonts", "@nuxt/icon", "@nuxt/image", "@nuxt/scripts", "shadcn-nuxt"],
	vite: {
		plugins: [tailwindcss()],
	},
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
		 * Prefix for all the imported component
		 */
		prefix: "",
		/**
		 * Directory that the component lives in.
		 * @default "./components/ui"
		 */
		componentDir: "./app/components/ui",
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
});
