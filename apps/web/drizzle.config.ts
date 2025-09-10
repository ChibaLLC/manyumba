import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./server/db/drizzle",
	dialect: "postgresql",
	schema: "./server/db/schema/index.ts",
	verbose: true,
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
