ALTER TABLE "device" ADD COLUMN "uuid1" uuid DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "uuid1" uuid DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "device" DROP COLUMN IF EXISTS "id";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "id";