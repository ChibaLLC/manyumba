import { defineConfig } from "drizzle-kit";
import { getCredentials } from "./server/db";
import { stringifyParsedURL } from "ufo";

const credentials = getCredentials();

export default defineConfig({
  out: "./server/db/drizzle",
  dialect: "postgresql",
  schema: "./server/db/schema/index.ts",
  verbose: true,
  dbCredentials: {
    url: stringifyParsedURL({
      host: credentials.host,
      pathname: credentials.database,
      protocol: "postgresql://",
      auth: `${credentials.username}:${credentials.password}`,
    }),
  },
});
