ALTER TABLE "task" ADD COLUMN "trackedTime" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "country_code" varchar(5) DEFAULT '+91' NOT NULL;--> statement-breakpoint
ALTER TABLE "task" DROP COLUMN IF EXISTS "tracked_time";