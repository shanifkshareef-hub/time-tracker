CREATE TABLE IF NOT EXISTS "project" (
	"uuid1" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task" (
	"uuid1" uuid,
	"name" text,
	"description" text,
	"status" text,
	"priority" text DEFAULT 'none',
	"created_at" timestamp,
	"updated_at" timestamp
);
