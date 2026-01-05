import { defineContentConfig, defineCollection, z, type CollectionSource } from "@nuxt/content";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const cwd = dirname(fileURLToPath(import.meta.url));
function source(path: string): CollectionSource {
	return {
		cwd: join(cwd, "content"),
		include: path,
	};
}

const buttonSchema = z.object({
	label: z.string(),
	icon: z.string(),
	trailingIcon: z.string(),
	to: z.string(),
	color: z.enum(["primary", "neutral"]).optional(),
	size: z.enum(["sm", "md", "lg", "xl"]).optional(),
	variant: z.enum(["solid", "outline", "subtle", "link"]).optional(),
	id: z.string().optional(),
	target: z.enum(["_blank", "_self"]).optional(),
});

const pageHeroSchema = z.object({
	title: z.string(),
	description: z.string(),
	image: z
		.object({
			width: z.number().optional(),
			height: z.number().optional(),
			light: z.string().editor({ input: "media" }),
			dark: z.string().editor({ input: "media" }),
		})
		.optional(),
	headline: z
		.object({
			label: z.string(),
			to: z.string(),
			icon: z.string().optional().editor({ input: "icon" }),
		})
		.optional(),
	links: z.array(buttonSchema).optional(),
});

const pageFeatureSchema = z.object({
	title: z.string(),
	description: z.string(),
	icon: z.string().editor({ input: "icon" }),
	to: z.string().optional(),
	target: z.enum(["_blank", "_self"]).optional(),
	soon: z.boolean().optional(),
});

const pageSectionSchema = z.object({
	id: z.string().optional(),
	title: z.string(),
	description: z.string(),
	links: z.array(buttonSchema),
	features: z.array(pageFeatureSchema),
	image: z.object({
		light: z.string().editor({ input: "media" }),
		dark: z.string().editor({ input: "media" }),
		width: z.number().optional(),
		height: z.number().optional(),
	}),
});

export default defineContentConfig({
	collections: {
		blog: defineCollection({
			type: "page",
			source: source("blog/**/*"),
			schema: z.object({
				title: z.string().nonempty(),
				description: z.string().nonempty(),
				date: z.string(),
				minRead: z.number(),
				image: z.string(),
				tags: z.array(z.string()),
				word: z.string(),
				authors: z.array(
					z.object({
						name: z.string(),
						description: z.string(),
						to: z.string(),
						target: z.string(),
						avatar: z
							.object({
								src: z.string(),
								alt: z.string(),
							})
							.optional(),
					})
				),
			}),
		}),
		docs: defineCollection({
			type: "page",
			source: "docs/**/*",
			schema: z.object({
				navigation: z.object({
					title: z.string().optional(),
				}),
				links: z.array(
					z.object({
						label: z.string(),
						icon: z.string(),
						avatar: z
							.object({
								src: z.string(),
								alt: z.string(),
							})
							.optional(),
						to: z.string(),
						target: z.string().optional(),
					})
				),
				layout: z.string().optional(),
			}),
		}),
		blogPage: defineCollection({
			type: "data",
			source: source("blog.yml"),
			schema: z.object({
				title: z.string().nonempty(),
				description: z.string().nonempty(),
			}),
		}),
		index: defineCollection({
			type: "data",
			source: source("index.yml"),
			schema: z.object({
				hero: pageHeroSchema,
				sections: z.array(pageSectionSchema),
				features: pageSectionSchema,
				faq: pageSectionSchema.extend({
					items: z.array(
						z.object({
							label: z.string().nonempty(),
							defaultOpen: z.boolean().optional(),
							content: z.string().nonempty(),
						})
					),
				}),
				cta: pageSectionSchema.extend({
					dynamicTitle: z.object({
						morning: z.string(),
						afternoon: z.string(),
						evening: z.string(),
						default: z.string(),
					}),
				}),
			}),
		}),
		legal: defineCollection({
			type: "page",
			source: "legal/**/*.md",
			schema: z.object({
				title: z.string().nonempty(),
				description: z.string().nonempty(),
				lastUpdated: z.string(),
				effectiveDate: z.string(),
			}),
		}),
	},
});
