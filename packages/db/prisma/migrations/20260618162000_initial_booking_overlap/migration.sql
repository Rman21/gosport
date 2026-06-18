-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- Required for GiST equality checks on text resource IDs in the booking
-- exclusion constraint below.
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('resident', 'guardian', 'coach', 'school_operator', 'facility_operator', 'city_admin', 'system');

-- CreateEnum
CREATE TYPE "FacilityKind" AS ENUM ('court', 'hall', 'sport_center', 'program', 'public_space');

-- CreateEnum
CREATE TYPE "FacilityStatus" AS ENUM ('bookable', 'needs_confirmation', 'info_only');

-- CreateEnum
CREATE TYPE "InventoryKind" AS ENUM ('court_rental', 'coach_session', 'group_class', 'open_play');

-- CreateEnum
CREATE TYPE "SourceConfidence" AS ENUM ('official_info', 'manual_review', 'operator_confirmed', 'live_inventory');

-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('fresh', 'stale', 'conflicting', 'blocked');

-- CreateEnum
CREATE TYPE "HoldStatus" AS ENUM ('held', 'expired', 'released', 'converted');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('confirmed', 'cancelled', 'refunded');

-- CreateEnum
CREATE TYPE "OccupancyStatus" AS ENUM ('held', 'confirmed', 'cancelled', 'expired', 'released');

-- CreateEnum
CREATE TYPE "PaymentIntentStatus" AS ENUM ('requires_confirmation', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded');

-- CreateTable
CREATE TABLE "user_accounts" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'resident',
    "name" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facilities" (
    "id" TEXT NOT NULL,
    "external_id" TEXT,
    "kind" "FacilityKind" NOT NULL,
    "status" "FacilityStatus" NOT NULL DEFAULT 'needs_confirmation',
    "name" JSONB NOT NULL,
    "neighborhood" JSONB,
    "address" JSONB,
    "source_url" TEXT NOT NULL,
    "source_checked_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_resources" (
    "id" TEXT NOT NULL,
    "facility_id" TEXT NOT NULL,
    "kind" "InventoryKind" NOT NULL,
    "exclusive_use" BOOLEAN NOT NULL DEFAULT false,
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "min_age" INTEGER,
    "max_age" INTEGER,
    "name" JSONB NOT NULL,
    "description" JSONB,
    "source_confidence" "SourceConfidence" NOT NULL DEFAULT 'official_info',
    "sync_status" "SyncStatus" NOT NULL DEFAULT 'fresh',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "inventory_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_slots" (
    "id" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "starts_at" TIMESTAMPTZ(6) NOT NULL,
    "ends_at" TIMESTAMPTZ(6) NOT NULL,
    "title" JSONB NOT NULL,
    "price_agorot" INTEGER,
    "capacity" INTEGER NOT NULL,
    "remaining_mirror" INTEGER,
    "source_url" TEXT NOT NULL,
    "source_confidence" "SourceConfidence" NOT NULL DEFAULT 'official_info',
    "sync_status" "SyncStatus" NOT NULL DEFAULT 'fresh',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "booking_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slot_capacities" (
    "slot_id" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "held_units" INTEGER NOT NULL DEFAULT 0,
    "confirmed_units" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "slot_capacities_pkey" PRIMARY KEY ("slot_id")
);

-- CreateTable
CREATE TABLE "booking_holds" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "slot_id" TEXT NOT NULL,
    "idempotency_key" TEXT NOT NULL,
    "requested_units" INTEGER NOT NULL DEFAULT 1,
    "status" "HoldStatus" NOT NULL DEFAULT 'held',
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "booking_holds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "hold_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "slot_id" TEXT NOT NULL,
    "idempotency_key" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'confirmed',
    "confirmed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_occupancies" (
    "id" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "slot_id" TEXT NOT NULL,
    "hold_id" TEXT,
    "booking_id" TEXT,
    "starts_at" TIMESTAMPTZ(6) NOT NULL,
    "ends_at" TIMESTAMPTZ(6) NOT NULL,
    "claimed_units" INTEGER NOT NULL DEFAULT 1,
    "exclusive_use" BOOLEAN NOT NULL DEFAULT false,
    "status" "OccupancyStatus" NOT NULL DEFAULT 'held',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "booking_occupancies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_intents" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_intent_id" TEXT NOT NULL,
    "hold_id" TEXT NOT NULL,
    "booking_id" TEXT,
    "amount_agorot" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ILS',
    "status" "PaymentIntentStatus" NOT NULL DEFAULT 'requires_confirmation',
    "idempotency_key" TEXT NOT NULL,
    "redacted_method" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "payment_intents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_events" (
    "id" TEXT NOT NULL,
    "payment_intent_id" TEXT NOT NULL,
    "provider_event_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "payload_redacted" JSONB NOT NULL,
    "received_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source_snapshots" (
    "id" TEXT NOT NULL,
    "facility_id" TEXT,
    "source_url" TEXT NOT NULL,
    "source_observed_at" TIMESTAMPTZ(6) NOT NULL,
    "source_confidence" "SourceConfidence" NOT NULL,
    "sync_status" "SyncStatus" NOT NULL,
    "payload_redacted" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "source_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_events" (
    "id" TEXT NOT NULL,
    "actor_user_id" TEXT,
    "actor_role" "UserRole" NOT NULL DEFAULT 'system',
    "action" TEXT NOT NULL,
    "subject_type" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "idempotency_key" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_accounts_email_key" ON "user_accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "facilities_external_id_key" ON "facilities"("external_id");

-- CreateIndex
CREATE INDEX "facilities_kind_idx" ON "facilities"("kind");

-- CreateIndex
CREATE INDEX "facilities_status_idx" ON "facilities"("status");

-- CreateIndex
CREATE INDEX "inventory_resources_facility_id_kind_idx" ON "inventory_resources"("facility_id", "kind");

-- CreateIndex
CREATE INDEX "inventory_resources_exclusive_use_idx" ON "inventory_resources"("exclusive_use");

-- CreateIndex
CREATE INDEX "booking_slots_resource_id_starts_at_idx" ON "booking_slots"("resource_id", "starts_at");

-- CreateIndex
CREATE INDEX "booking_slots_source_confidence_sync_status_idx" ON "booking_slots"("source_confidence", "sync_status");

-- CreateIndex
CREATE UNIQUE INDEX "booking_holds_idempotency_key_key" ON "booking_holds"("idempotency_key");

-- CreateIndex
CREATE INDEX "booking_holds_user_id_status_idx" ON "booking_holds"("user_id", "status");

-- CreateIndex
CREATE INDEX "booking_holds_slot_id_status_idx" ON "booking_holds"("slot_id", "status");

-- CreateIndex
CREATE INDEX "booking_holds_expires_at_idx" ON "booking_holds"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_hold_id_key" ON "bookings"("hold_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_idempotency_key_key" ON "bookings"("idempotency_key");

-- CreateIndex
CREATE INDEX "bookings_user_id_status_idx" ON "bookings"("user_id", "status");

-- CreateIndex
CREATE INDEX "bookings_slot_id_status_idx" ON "bookings"("slot_id", "status");

-- CreateIndex
CREATE INDEX "booking_occupancies_resource_id_starts_at_idx" ON "booking_occupancies"("resource_id", "starts_at");

-- CreateIndex
CREATE INDEX "booking_occupancies_slot_id_status_idx" ON "booking_occupancies"("slot_id", "status");

-- CreateIndex
CREATE INDEX "booking_occupancies_hold_id_idx" ON "booking_occupancies"("hold_id");

-- CreateIndex
CREATE INDEX "booking_occupancies_booking_id_idx" ON "booking_occupancies"("booking_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_intents_provider_intent_id_key" ON "payment_intents"("provider_intent_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_intents_hold_id_key" ON "payment_intents"("hold_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_intents_booking_id_key" ON "payment_intents"("booking_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_intents_idempotency_key_key" ON "payment_intents"("idempotency_key");

-- CreateIndex
CREATE INDEX "payment_intents_status_idx" ON "payment_intents"("status");

-- CreateIndex
CREATE UNIQUE INDEX "payment_events_provider_event_id_key" ON "payment_events"("provider_event_id");

-- CreateIndex
CREATE INDEX "payment_events_payment_intent_id_idx" ON "payment_events"("payment_intent_id");

-- CreateIndex
CREATE INDEX "source_snapshots_source_confidence_sync_status_idx" ON "source_snapshots"("source_confidence", "sync_status");

-- CreateIndex
CREATE INDEX "source_snapshots_source_observed_at_idx" ON "source_snapshots"("source_observed_at");

-- CreateIndex
CREATE INDEX "audit_events_subject_type_subject_id_idx" ON "audit_events"("subject_type", "subject_id");

-- CreateIndex
CREATE INDEX "audit_events_actor_user_id_created_at_idx" ON "audit_events"("actor_user_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_events_idempotency_key_idx" ON "audit_events"("idempotency_key");

-- AddForeignKey
ALTER TABLE "inventory_resources" ADD CONSTRAINT "inventory_resources_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_slots" ADD CONSTRAINT "booking_slots_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "inventory_resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot_capacities" ADD CONSTRAINT "slot_capacities_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "booking_slots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_holds" ADD CONSTRAINT "booking_holds_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_holds" ADD CONSTRAINT "booking_holds_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "booking_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_hold_id_fkey" FOREIGN KEY ("hold_id") REFERENCES "booking_holds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "booking_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_occupancies" ADD CONSTRAINT "booking_occupancies_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "inventory_resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_occupancies" ADD CONSTRAINT "booking_occupancies_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "booking_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_occupancies" ADD CONSTRAINT "booking_occupancies_hold_id_fkey" FOREIGN KEY ("hold_id") REFERENCES "booking_holds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_occupancies" ADD CONSTRAINT "booking_occupancies_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_intents" ADD CONSTRAINT "payment_intents_hold_id_fkey" FOREIGN KEY ("hold_id") REFERENCES "booking_holds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_intents" ADD CONSTRAINT "payment_intents_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_events" ADD CONSTRAINT "payment_events_payment_intent_id_fkey" FOREIGN KEY ("payment_intent_id") REFERENCES "payment_intents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "source_snapshots" ADD CONSTRAINT "source_snapshots_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Custom constraints Prisma cannot express.

ALTER TABLE "booking_slots"
  ADD CONSTRAINT "booking_slots_positive_duration"
  CHECK ("ends_at" > "starts_at");

ALTER TABLE "booking_slots"
  ADD CONSTRAINT "booking_slots_capacity_positive"
  CHECK ("capacity" > 0);

ALTER TABLE "inventory_resources"
  ADD CONSTRAINT "inventory_resources_capacity_positive"
  CHECK ("capacity" > 0);

ALTER TABLE "slot_capacities"
  ADD CONSTRAINT "slot_capacities_units_valid"
  CHECK (
    "capacity" > 0
    AND "held_units" >= 0
    AND "confirmed_units" >= 0
    AND ("held_units" + "confirmed_units") <= "capacity"
  );

ALTER TABLE "booking_occupancies"
  ADD CONSTRAINT "booking_occupancies_positive_duration"
  CHECK ("ends_at" > "starts_at");

ALTER TABLE "booking_occupancies"
  ADD CONSTRAINT "booking_occupancies_claimed_units_positive"
  CHECK ("claimed_units" > 0);

ALTER TABLE "booking_occupancies"
  ADD CONSTRAINT "booking_occupancies_has_hold_or_booking"
  CHECK ("hold_id" IS NOT NULL OR "booking_id" IS NOT NULL);

ALTER TABLE "payment_intents"
  ADD CONSTRAINT "payment_intents_amount_positive"
  CHECK ("amount_agorot" >= 0);

ALTER TABLE "booking_occupancies"
  ADD CONSTRAINT "booking_occupancies_no_exclusive_overlap"
  EXCLUDE USING gist (
    "resource_id" WITH =,
    tstzrange("starts_at", "ends_at", '[)') WITH &&
  )
  WHERE (
    "exclusive_use" = true
    AND "status" IN ('held', 'confirmed')
  );

CREATE INDEX "booking_occupancies_group_capacity_lookup"
  ON "booking_occupancies" ("slot_id", "status")
  WHERE "exclusive_use" = false AND "status" IN ('held', 'confirmed');

CREATE INDEX "booking_holds_expiry_active"
  ON "booking_holds" ("expires_at")
  WHERE "status" = 'held';
