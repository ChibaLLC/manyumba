import { defineConfig } from "drizzle-kit";
import { getCredentials } from "./server/db/index";

const credentials = getCredentials();

export default defineConfig({
  out: "./server/db/drizzle",
  dialect: "postgresql",
  schema: "./server/db/schema/index.ts",
  verbose: true,
  dbCredentials: {
    url: `${credentials.dialect}://${credentials.username}:${credentials.password}@${credentials.host}:${credentials.port}/${credentials.database}`,
  },
});
