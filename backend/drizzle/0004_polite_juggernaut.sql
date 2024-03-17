ALTER TABLE "device" ADD PRIMARY KEY ("uuid1");--> statement-breakpoint
ALTER TABLE "device" ALTER COLUMN "uuid1" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD PRIMARY KEY ("uuid1");--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "uuid1" SET NOT NULL;