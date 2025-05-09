CREATE TABLE "sessions" (
	"ulid" varchar PRIMARY KEY NOT NULL,
	"user_ulid" varchar NOT NULL,
	"token" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"ulid" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"is_deleted" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_ulid_users_ulid_fk" FOREIGN KEY ("user_ulid") REFERENCES "public"."users"("ulid") ON DELETE cascade ON UPDATE no action;