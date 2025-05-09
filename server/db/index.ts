import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import postgres from "postgres";

const credentials = new URL(process.env.DATABASE_URL!);

const connection = postgres({
	host: credentials.host,
	password: credentials.password,
	port: parseInt(credentials.port),
	database: credentials.pathname.replace("/", ""),
	username: credentials.username,
});

const db = drizzle(connection, {
	schema: schema,
});
export default db;
