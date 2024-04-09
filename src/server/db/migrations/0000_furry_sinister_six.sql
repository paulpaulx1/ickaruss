CREATE TABLE IF NOT EXISTS "zicuras_account" (
	"userId" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "zicuras_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "zicuras_post" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"createdById" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "zicuras_service" (
	"id" serial PRIMARY KEY NOT NULL,
	"vendorId" varchar(255) NOT NULL,
	"serviceName" varchar(255),
	"serviceDescription" text,
	"price" integer,
	"currency" varchar(3),
	"video" varchar(255),
	"image" varchar(255),
	"stripeProductId" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "zicuras_session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "zicuras_transaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"vendorId" varchar(255),
	"amount" integer,
	"currency" varchar(3),
	"transactionType" varchar(50),
	"status" varchar(50),
	"stripeCheckoutSessionId" varchar(255),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "zicuras_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255),
	"city" varchar(100),
	"state" varchar(100),
	"postalCode" varchar(20),
	"isVendor" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "zicuras_vendor" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"businessName" varchar(255),
	"businessDescription" text,
	"accountCreated" boolean DEFAULT false,
	"stripeAccountId" varchar(255),
	"isSubscribed" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "zicuras_verificationToken" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "zicuras_verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "zicuras_account" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "createdById_idx" ON "zicuras_post" ("createdById");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "zicuras_post" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "service_vendorId_idx" ON "zicuras_service" ("vendorId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "zicuras_session" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transaction_userId_idx" ON "zicuras_transaction" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transaction_vendorId_idx" ON "zicuras_transaction" ("vendorId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transaction_stripeSessionId_idx" ON "zicuras_transaction" ("stripeCheckoutSessionId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transaction_transactionType_idx" ON "zicuras_transaction" ("transactionType");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "vendor_userId_idx" ON "zicuras_vendor" ("userId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zicuras_account" ADD CONSTRAINT "zicuras_account_userId_zicuras_user_id_fk" FOREIGN KEY ("userId") REFERENCES "zicuras_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zicuras_post" ADD CONSTRAINT "zicuras_post_createdById_zicuras_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "zicuras_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zicuras_service" ADD CONSTRAINT "zicuras_service_vendorId_zicuras_vendor_id_fk" FOREIGN KEY ("vendorId") REFERENCES "zicuras_vendor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zicuras_session" ADD CONSTRAINT "zicuras_session_userId_zicuras_user_id_fk" FOREIGN KEY ("userId") REFERENCES "zicuras_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zicuras_transaction" ADD CONSTRAINT "zicuras_transaction_userId_zicuras_user_id_fk" FOREIGN KEY ("userId") REFERENCES "zicuras_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zicuras_transaction" ADD CONSTRAINT "zicuras_transaction_vendorId_zicuras_vendor_id_fk" FOREIGN KEY ("vendorId") REFERENCES "zicuras_vendor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zicuras_vendor" ADD CONSTRAINT "zicuras_vendor_userId_zicuras_user_id_fk" FOREIGN KEY ("userId") REFERENCES "zicuras_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
