CREATE TYPE "verification_status" AS ENUM (
  'pending',
  'verified',
  'rejected'
);

CREATE TYPE "account_status" AS ENUM (
  'active',
  'suspended',
  'flagged'
);

CREATE TYPE "report_status" AS ENUM (
  'pending',
  'resolved',
  'dismissed'
);

CREATE TYPE "report_type" AS ENUM (
  'wrong_availability',
  'wrong_location',
  'wrong_contact',
  'other'
);

CREATE TABLE "users" (
  "id" bigserial PRIMARY KEY,
  "name" varchar,
  "email" varchar UNIQUE,
  "password" varchar,
  "role" varchar,
  "phone" varchar,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "pharmacies" (
  "id" bigserial PRIMARY KEY,
  "pharmacist_id" bigint,
  "name" varchar,
  "address" text,
  "location" geometry(point,4326),
  "phone" varchar,
  "verified" boolean DEFAULT false,
  "license_number" varchar,
  "verification_status" verification_status DEFAULT 'pending',
  "rejection_reason" text,
  "rating" numeric,
  "account_status" account_status DEFAULT 'active',
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "pharmacy_documents" (
  "id" bigserial PRIMARY KEY,
  "pharmacy_id" bigint,
  "file_path" varchar,
  "doc_type" varchar,
  "created_at" timestamp
);

CREATE TABLE "medicines" (
  "id" bigserial PRIMARY KEY,
  "name" varchar,
  "generic_name" varchar,
  "category" varchar,
  "description" text,
  "created_at" timestamp
);

CREATE TABLE "pharmacy_medicines" (
  "pharmacy_id" bigint,
  "medicine_id" bigint,
  "quantity" int,
  "price" numeric,
  "available" boolean DEFAULT true,
  PRIMARY KEY ("pharmacy_id", "medicine_id")
);

CREATE TABLE "pharmacy_reports" (
  "id" bigserial PRIMARY KEY,
  "pharmacy_id" bigint,
  "user_id" bigint,
  "reason" text,
  "report_type" report_type NOT NULL,
  "report_status" report_status DEFAULT 'pending',
  "resolution_notes" text,
  "created_at" timestamp,
  "updated_at" timestamp
);

ALTER TABLE "pharmacies" ADD FOREIGN KEY ("pharmacist_id") REFERENCES "users" ("id");

ALTER TABLE "pharmacy_documents" ADD FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies" ("id");

ALTER TABLE "pharmacy_medicines" ADD FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies" ("id");

ALTER TABLE "pharmacy_medicines" ADD FOREIGN KEY ("medicine_id") REFERENCES "medicines" ("id");

ALTER TABLE "pharmacy_reports" ADD FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies" ("id");

ALTER TABLE "pharmacy_reports" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
