// https://nuxt.com/docs/api/configuration/nuxt-config
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
				name: "geel-content",
				owner: "AllanBosire",
				url: "https://github.com/AllanBosire/geel-content",
			},
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
			link: [{ rel: "icon", type: "image/svg+xml", href: "/finueva.svg" }],
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
		url: "https://finueva.com",
		name: "Finueva",
	},
	$development: {
		site: {
			url: "http://localhost:3000",
			name: "Developing Awesome Website",
		},
	},
	devServer: {
		port: 4000,
	},
});
