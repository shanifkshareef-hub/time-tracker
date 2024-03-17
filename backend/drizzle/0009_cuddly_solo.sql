ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT (strftime('%s', 'now'));--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT (strftime('%s', 'now'));--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "id" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "uuid1";