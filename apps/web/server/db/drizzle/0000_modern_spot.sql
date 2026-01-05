CREATE TYPE "public"."user_role" AS ENUM('admin', 'agent', 'client');--> statement-breakpoint
CREATE TYPE "public"."appointment_status" AS ENUM('pending', 'confirmed', 'cancelled', 'completed');--> statement-breakpoint
CREATE TYPE "public"."listing_type" AS ENUM('rent', 'sale');--> statement-breakpoint
CREATE TYPE "public"."property_type" AS ENUM('apartment', 'house', 'commercial', 'plot', 'land');--> statement-breakpoint
CREATE TABLE "favorites" (
	"user_ulid" varchar NOT NULL,
	"property_ulid" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "favorites_user_ulid_property_ulid_pk" PRIMARY KEY("user_ulid","property_ulid")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"ulid" varchar PRIMARY KEY NOT NULL,
	"user_ulid" varchar NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"link" varchar(255),
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"ulid" varchar PRIMARY KEY NOT NULL,
	"property_ulid" varchar NOT NULL,
	"user_ulid" varchar NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"is_approved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"ulid" varchar PRIMARY KEY NOT NULL,
	"user_ulid" varchar NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"ulid" varchar PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"phone" varchar(20),
	"role" "user_role" DEFAULT 'client' NOT NULL,
	"profile_image" varchar(255),
	"is_verified" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "appointments" (
	"ulid" varchar PRIMARY KEY NOT NULL,
	"property_ulid" varchar NOT NULL,
	"client_ulid" varchar NOT NULL,
	"agent_ulid" varchar,
	"date_time" timestamp NOT NULL,
	"duration" integer DEFAULT 30 NOT NULL,
	"status" "appointment_status" DEFAULT 'pending' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"ulid" varchar PRIMARY KEY NOT NULL,
	"sender_ulid" varchar NOT NULL,
	"receiver_ulid" varchar NOT NULL,
	"property_ulid" varchar,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"ulid" varchar PRIMARY KEY NOT NULL,
	"owner_ulid" varchar NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"property_type" "property_type" NOT NULL,
	"listing_type" "listing_type" NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"address" varchar(255) NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"zip_code" varchar(20) NOT NULL,
	"country" varchar(100) NOT NULL,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"bedrooms" integer,
	"bathrooms" integer,
	"area" numeric(10, 2),
	"year_built" integer,
	"features" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_images" (
	"ulid" varchar PRIMARY KEY NOT NULL,
	"property_ulid" varchar NOT NULL,
	"image_url" varchar(255) NOT NULL,
	"is_featured" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_ulid_users_ulid_fk" FOREIGN KEY ("user_ulid") REFERENCES "public"."users"("ulid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_property_ulid_properties_ulid_fk" FOREIGN KEY ("property_ulid") REFERENCES "public"."properties"("ulid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_ulid_users_ulid_fk" FOREIGN KEY ("user_ulid") REFERENCES "public"."users"("ulid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_property_ulid_properties_ulid_fk" FOREIGN KEY ("property_ulid") REFERENCES "public"."properties"("ulid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_ulid_users_ulid_fk" FOREIGN KEY ("user_ulid") REFERENCES "public"."users"("ulid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_ulid_users_ulid_fk" FOREIGN KEY ("user_ulid") REFERENCES "public"."users"("ulid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_property_ulid_properties_ulid_fk" FOREIGN KEY ("property_ulid") REFERENCES "public"."properties"("ulid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_client_ulid_users_ulid_fk" FOREIGN KEY ("client_ulid") REFERENCES "public"."users"("ulid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_agent_ulid_users_ulid_fk" FOREIGN KEY ("agent_ulid") REFERENCES "public"."users"("ulid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_ulid_users_ulid_fk" FOREIGN KEY ("sender_ulid") REFERENCES "public"."users"("ulid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiver_ulid_users_ulid_fk" FOREIGN KEY ("receiver_ulid") REFERENCES "public"."users"("ulid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_property_ulid_properties_ulid_fk" FOREIGN KEY ("property_ulid") REFERENCES "public"."properties"("ulid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_owner_ulid_users_ulid_fk" FOREIGN KEY ("owner_ulid") REFERENCES "public"."users"("ulid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_property_ulid_properties_ulid_fk" FOREIGN KEY ("property_ulid") REFERENCES "public"."properties"("ulid") ON DELETE cascade ON UPDATE no action;