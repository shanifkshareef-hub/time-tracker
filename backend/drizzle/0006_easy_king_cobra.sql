DROP TABLE "device";--> statement-breakpoint
ALTER TABLE "task" ADD PRIMARY KEY ("uuid1");--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "uuid1" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "uuid1" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "assigned_to_user_id" uuid;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "project_id" uuid;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "tracked_time" timestamp;