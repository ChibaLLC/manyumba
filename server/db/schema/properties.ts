import { boolean, decimal, integer, jsonb, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { ulid } from "ulid";
import { users } from "./users";

export const propertyTypeEnum = pgEnum("property_type", ["apartment", "house", "commercial", "plot", "land"]);
export const listingTypeEnum = pgEnum("listing_type", ["rent", "sale"]);
export const appointmentStatusEnum = pgEnum("appointment_status", ["pending", "confirmed", "cancelled", "completed"]);
// Properties Table
export const properties = pgTable("properties", {
	ulid: varchar("ulid").primaryKey().$defaultFn(ulid).notNull(),
	ownerUlid: varchar("owner_ulid")
		.notNull()
		.references(() => users.ulid, { onDelete: "cascade" }),
	title: varchar("title", { length: 255 }).notNull(),
	description: text("description").notNull(),
	propertyType: propertyTypeEnum("property_type").notNull(),
	listingType: listingTypeEnum("listing_type").notNull(),
	price: decimal("price", { precision: 12, scale: 2 }).notNull(),
	address: varchar("address", { length: 255 }).notNull(),
	city: varchar("city", { length: 100 }).notNull(),
	state: varchar("state", { length: 100 }).notNull(),
	zipCode: varchar("zip_code", { length: 20 }).notNull(),
	country: varchar("country", { length: 100 }).notNull(),
	latitude: decimal("latitude", { precision: 10, scale: 7 }),
	longitude: decimal("longitude", { precision: 10, scale: 7 }),
	bedrooms: integer("bedrooms"),
	bathrooms: integer("bathrooms"),
	area: decimal("area", { precision: 10, scale: 2 }), // in sq ft or sq meters
	yearBuilt: integer("year_built"),
	features: jsonb("features").default({}).notNull(), // Store features as JSON
	isPublished: boolean("is_published").default(false).notNull(),
	isDeleted: boolean("is_deleted").default(false),
	createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

// Property Images Table
export const propertyImages = pgTable("property_images", {
	ulid: varchar("ulid").primaryKey().$defaultFn(ulid).notNull(),
	propertyUlid: varchar("property_ulid")
		.notNull()
		.references(() => properties.ulid, { onDelete: "cascade" }),
	imageUrl: varchar("image_url", { length: 255 }).notNull(),
	isFeatured: boolean("is_featured").default(false),
	sortOrder: integer("sort_order").default(0),
	createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

// Messages Table
export const messages = pgTable("messages", {
	ulid: varchar("ulid").primaryKey().$defaultFn(ulid).notNull(),
	senderUlid: varchar("sender_ulid")
		.notNull()
		.references(() => users.ulid, { onDelete: "cascade" }),
	receiverUlid: varchar("receiver_ulid")
		.notNull()
		.references(() => users.ulid, { onDelete: "cascade" }),
	propertyUlid: varchar("property_ulid").references(() => properties.ulid, { onDelete: "set null" }),
	message: text("message").notNull(),
	isRead: boolean("is_read").default(false),
	createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

// Appointments (Showings) Table
export const appointments = pgTable("appointments", {
	ulid: varchar("ulid").primaryKey().$defaultFn(ulid).notNull(),
	propertyUlid: varchar("property_ulid")
		.notNull()
		.references(() => properties.ulid, { onDelete: "cascade" }),
	clientUlid: varchar("client_ulid")
		.notNull()
		.references(() => users.ulid, { onDelete: "cascade" }),
	agentUlid: varchar("agent_ulid").references(() => users.ulid, { onDelete: "set null" }),
	dateTime: timestamp("date_time", { mode: "string" }).notNull(),
	duration: integer("duration").default(30).notNull(), // in minutes
	status: appointmentStatusEnum("status").default("pending").notNull(),
	notes: text("notes"),
	createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});
