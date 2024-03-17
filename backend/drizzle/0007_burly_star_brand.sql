ALTER TABLE "user" RENAME COLUMN "role" TO "first_name";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "last_name" text;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "name";