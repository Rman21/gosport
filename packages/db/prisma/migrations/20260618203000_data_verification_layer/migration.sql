-- Add a data provenance and verification layer for the Netanya sports catalog.
-- This separates "known and bookable" inventory from live-registration,
-- public-space, contact-only, and needs-verification records.

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM (
    'live_bookable',
    'live_registration',
    'active_contact_only',
    'info_only',
    'needs_verification',
    'archived_closed'
);

-- CreateEnum
CREATE TYPE "BookingMethod" AS ENUM (
    'instant_payment',
    'external_registration',
    'contact_request',
    'phone_whatsapp',
    'free_public',
    'info_only'
);

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM (
    'card_supported',
    'external_payment',
    'no_payment',
    'unknown'
);

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM (
    'official_municipal',
    'partner_site',
    'external_registration',
    'sports_association',
    'directory',
    'social',
    'manual_research'
);

-- CreateEnum
CREATE TYPE "OrganizationKind" AS ENUM (
    'municipality',
    'community_center',
    'private_club',
    'sports_association',
    'school_provider',
    'coach_school',
    'swim_school',
    'fitness_box'
);

-- CreateEnum
CREATE TYPE "VerificationTaskStatus" AS ENUM (
    'open',
    'in_progress',
    'verified',
    'blocked',
    'archived'
);

-- CreateEnum
CREATE TYPE "VerificationTaskPriority" AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "kind" "OrganizationKind" NOT NULL,
    "name" JSONB NOT NULL,
    "description" JSONB,
    "website_url" TEXT,
    "contact_phone" TEXT,
    "whatsapp" TEXT,
    "source_type" "SourceType" NOT NULL DEFAULT 'manual_research',
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'needs_verification',
    "source_url" TEXT,
    "source_notes" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "facilities"
  ADD COLUMN "organization_id" TEXT,
  ADD COLUMN "verification_status" "VerificationStatus" NOT NULL DEFAULT 'info_only',
  ADD COLUMN "booking_method" "BookingMethod" NOT NULL DEFAULT 'contact_request',
  ADD COLUMN "payment_method" "PaymentMethod" NOT NULL DEFAULT 'unknown',
  ADD COLUMN "source_type" "SourceType" NOT NULL DEFAULT 'official_municipal',
  ADD COLUMN "contact_phone" TEXT,
  ADD COLUMN "whatsapp" TEXT,
  ADD COLUMN "external_registration_url" TEXT,
  ADD COLUMN "confidence_score" INTEGER,
  ADD COLUMN "source_notes" JSONB,
  ADD COLUMN "last_verified_at" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "programs"
  ADD COLUMN "organization_id" TEXT,
  ADD COLUMN "external_registration_url" TEXT,
  ADD COLUMN "contact_phone" TEXT,
  ADD COLUMN "whatsapp" TEXT,
  ADD COLUMN "verification_status" "VerificationStatus" NOT NULL DEFAULT 'info_only',
  ADD COLUMN "booking_method" "BookingMethod" NOT NULL DEFAULT 'contact_request',
  ADD COLUMN "payment_method" "PaymentMethod" NOT NULL DEFAULT 'unknown',
  ADD COLUMN "confidence_score" INTEGER,
  ADD COLUMN "source_notes" JSONB,
  ADD COLUMN "last_verified_at" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "offerings"
  ADD COLUMN "organization_id" TEXT,
  ADD COLUMN "external_registration_url" TEXT,
  ADD COLUMN "contact_phone" TEXT,
  ADD COLUMN "whatsapp" TEXT,
  ADD COLUMN "verification_status" "VerificationStatus" NOT NULL DEFAULT 'info_only',
  ADD COLUMN "booking_method" "BookingMethod" NOT NULL DEFAULT 'contact_request',
  ADD COLUMN "payment_method" "PaymentMethod" NOT NULL DEFAULT 'unknown',
  ADD COLUMN "confidence_score" INTEGER,
  ADD COLUMN "source_notes" JSONB,
  ADD COLUMN "last_verified_at" TIMESTAMPTZ(6);

-- CreateTable
CREATE TABLE "data_verification_tasks" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT,
    "facility_id" TEXT,
    "offering_id" TEXT,
    "program_id" TEXT,
    "title" JSONB NOT NULL,
    "notes" JSONB,
    "status" "VerificationTaskStatus" NOT NULL DEFAULT 'open',
    "priority" "VerificationTaskPriority" NOT NULL DEFAULT 'medium',
    "source_url" TEXT,
    "due_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "data_verification_tasks_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "data_verification_tasks_has_target_check" CHECK (
        "organization_id" IS NOT NULL
        OR "facility_id" IS NOT NULL
        OR "offering_id" IS NOT NULL
        OR "program_id" IS NOT NULL
    )
);

-- AddChecks
ALTER TABLE "facilities"
  ADD CONSTRAINT "facilities_confidence_score_valid_check"
  CHECK ("confidence_score" IS NULL OR ("confidence_score" >= 0 AND "confidence_score" <= 100));

ALTER TABLE "programs"
  ADD CONSTRAINT "programs_confidence_score_valid_check"
  CHECK ("confidence_score" IS NULL OR ("confidence_score" >= 0 AND "confidence_score" <= 100));

ALTER TABLE "offerings"
  ADD CONSTRAINT "offerings_confidence_score_valid_check"
  CHECK ("confidence_score" IS NULL OR ("confidence_score" >= 0 AND "confidence_score" <= 100));

-- CreateIndex
CREATE INDEX "organizations_kind_verification_status_idx" ON "organizations"("kind", "verification_status");

-- CreateIndex
CREATE INDEX "organizations_source_type_verification_status_idx" ON "organizations"("source_type", "verification_status");

-- CreateIndex
CREATE INDEX "facilities_organization_id_idx" ON "facilities"("organization_id");

-- CreateIndex
CREATE INDEX "facilities_verification_status_booking_method_idx" ON "facilities"("verification_status", "booking_method");

-- CreateIndex
CREATE INDEX "facilities_source_type_verification_status_idx" ON "facilities"("source_type", "verification_status");

-- CreateIndex
CREATE INDEX "programs_organization_id_idx" ON "programs"("organization_id");

-- CreateIndex
CREATE INDEX "programs_verification_status_booking_method_idx" ON "programs"("verification_status", "booking_method");

-- CreateIndex
CREATE INDEX "offerings_organization_id_idx" ON "offerings"("organization_id");

-- CreateIndex
CREATE INDEX "offerings_verification_status_booking_method_idx" ON "offerings"("verification_status", "booking_method");

-- CreateIndex
CREATE INDEX "data_verification_tasks_status_priority_idx" ON "data_verification_tasks"("status", "priority");

-- CreateIndex
CREATE INDEX "data_verification_tasks_facility_id_status_idx" ON "data_verification_tasks"("facility_id", "status");

-- CreateIndex
CREATE INDEX "data_verification_tasks_offering_id_status_idx" ON "data_verification_tasks"("offering_id", "status");

-- CreateIndex
CREATE INDEX "data_verification_tasks_program_id_status_idx" ON "data_verification_tasks"("program_id", "status");

-- CreateIndex
CREATE INDEX "data_verification_tasks_organization_id_status_idx" ON "data_verification_tasks"("organization_id", "status");

-- AddForeignKey
ALTER TABLE "facilities" ADD CONSTRAINT "facilities_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offerings" ADD CONSTRAINT "offerings_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_verification_tasks" ADD CONSTRAINT "data_verification_tasks_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_verification_tasks" ADD CONSTRAINT "data_verification_tasks_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_verification_tasks" ADD CONSTRAINT "data_verification_tasks_offering_id_fkey" FOREIGN KEY ("offering_id") REFERENCES "offerings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_verification_tasks" ADD CONSTRAINT "data_verification_tasks_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
