import { boolean, integer, pgEnum, pgTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { ulid } from "ulid";
import { properties } from "./properties";

export const userRoleEnum = pgEnum("user_role", ["admin", "agent", "client"]);
// Users Table
export const users = pgTable("users", {
	ulid: varchar("ulid").primaryKey().$defaultFn(ulid).notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).unique().notNull(),
	password: varchar("password", { length: 255 }).notNull(),
	phone: varchar("phone", { length: 20 }),
	role: userRoleEnum("role").default("client").notNull(),
	profileImage: varchar("profile_image", { length: 255 }),
	isVerified: boolean("is_verified").default(false).notNull(),
	isDeleted: boolean("is_deleted").default(false),
	lastLogin: timestamp("last_login", { mode: "string" }),
	createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

// Sessions Table
export const sessions = pgTable("sessions", {
	ulid: varchar("ulid").primaryKey().$defaultFn(ulid).notNull(),
	userUlid: varchar("user_ulid")
		.notNull()
		.references(() => users.ulid, { onDelete: "cascade" }),
	token: varchar("token", { length: 255 }).notNull(),
	expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
	createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

// Favorites Table (Properties favorited by users)
export const favorites = pgTable(
	"favorites",
	{
		userUlid: varchar("user_ulid")
			.notNull()
			.references(() => users.ulid, { onDelete: "cascade" }),
		propertyUlid: varchar("property_ulid")
			.notNull()
			.references(() => properties.ulid, { onDelete: "cascade" }),
		createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userUlid, t.propertyUlid] }),
	}),
);

export const reviews = pgTable("reviews", {
	ulid: varchar("ulid").primaryKey().$defaultFn(ulid).notNull(),
	propertyUlid: varchar("property_ulid")
		.notNull()
		.references(() => properties.ulid, { onDelete: "cascade" }),
	userUlid: varchar("user_ulid")
		.notNull()
		.references(() => users.ulid, { onDelete: "cascade" }),
	rating: integer("rating").notNull(), // 1-5 stars
	comment: text("comment"),
	isApproved: boolean("is_approved").default(false),
	createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});
// Notifications Table
export const notifications = pgTable("notifications", {
	ulid: varchar("ulid").primaryKey().$defaultFn(ulid).notNull(),
	userUlid: varchar("user_ulid")
		.notNull()
		.references(() => users.ulid, { onDelete: "cascade" }),
	title: varchar("title", { length: 255 }).notNull(),
	message: text("message").notNull(),
	link: varchar("link", { length: 255 }),
	isRead: boolean("is_read").default(false),
	createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});
