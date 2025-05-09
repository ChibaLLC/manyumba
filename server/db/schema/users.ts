import { boolean, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { ulid } from "ulid";
export const users = pgTable("users", {
	ulid: varchar("ulid").primaryKey().$defaultFn(ulid).notNull(),
	name: varchar("name").notNull(),
	email: varchar("email").unique().notNull(),
	password: varchar("password").notNull(),
	isDeleted: boolean("is_deleted"),
	createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
	ulid: varchar("ulid").primaryKey().$defaultFn(ulid).notNull(),
	userUlid: varchar("user_ulid")
		.notNull()
		.references(() => users.ulid, { onDelete: "cascade" }),
	token: varchar("token").notNull(),
	createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});
