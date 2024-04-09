CREATE TABLE IF NOT EXISTS "zicuras_booking" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"serviceId" integer NOT NULL,
	"status" varchar(50) DEFAULT 'pending',
	"depositPaid" boolean DEFAULT false,
	"finalPaymentPaid" boolean DEFAULT false,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "zicuras_deposit" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"serviceId" integer NOT NULL,
	"amount" integer,
	"status" varchar(50),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "zicuras_payment" (
	"id" serial PRIMARY KEY NOT NULL,
	"bookingId" integer NOT NULL,
	"userId" varchar(255) NOT NULL,
	"type" varchar(50),
	"amount" integer,
	"status" varchar(50),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "zicuras_service" ADD COLUMN "active" boolean DEFAULT true;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "booking_userId_idx" ON "zicuras_booking" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "booking_serviceId_idx" ON "zicuras_booking" ("serviceId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "deposit_userId_idx" ON "zicuras_deposit" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "deposit_serviceId_idx" ON "zicuras_deposit" ("serviceId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payment_bookingId_idx" ON "zicuras_payment" ("bookingId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payment_userId_idx" ON "zicuras_payment" ("userId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zicuras_booking" ADD CONSTRAINT "zicuras_booking_userId_zicuras_user_id_fk" FOREIGN KEY ("userId") REFERENCES "zicuras_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zicuras_booking" ADD CONSTRAINT "zicuras_booking_serviceId_zicuras_service_id_fk" FOREIGN KEY ("serviceId") REFERENCES "zicuras_service"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zicuras_deposit" ADD CONSTRAINT "zicuras_deposit_userId_zicuras_user_id_fk" FOREIGN KEY ("userId") REFERENCES "zicuras_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zicuras_deposit" ADD CONSTRAINT "zicuras_deposit_serviceId_zicuras_service_id_fk" FOREIGN KEY ("serviceId") REFERENCES "zicuras_service"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zicuras_payment" ADD CONSTRAINT "zicuras_payment_bookingId_zicuras_booking_id_fk" FOREIGN KEY ("bookingId") REFERENCES "zicuras_booking"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zicuras_payment" ADD CONSTRAINT "zicuras_payment_userId_zicuras_user_id_fk" FOREIGN KEY ("userId") REFERENCES "zicuras_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
