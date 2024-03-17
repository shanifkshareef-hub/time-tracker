ALTER TABLE "task" ADD COLUMN "tracked_time" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "task" DROP COLUMN IF EXISTS "trackedTime";