-- Expand the booking catalog from resource-only inventory to the domain shape:
-- Facility -> Space -> Sport capability -> Offering -> Slot.
-- Existing booking endpoints keep using inventory_resources while space_id becomes
-- the physical occupancy boundary for cross-sport overlap protection.

CREATE EXTENSION IF NOT EXISTS btree_gist;

-- CreateTable
CREATE TABLE "sports" (
    "id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "icon" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "sports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facility_spaces" (
    "id" TEXT NOT NULL,
    "facility_id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "description" JSONB,
    "capacity" INTEGER,
    "indoor" BOOLEAN,
    "surface" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "facility_spaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "space_sport_capabilities" (
    "id" TEXT NOT NULL,
    "space_id" TEXT NOT NULL,
    "sport_id" TEXT NOT NULL,
    "level" JSONB,
    "notes" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "space_sport_capabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coach_profiles" (
    "id" TEXT NOT NULL,
    "facility_id" TEXT,
    "name" JSONB NOT NULL,
    "bio" JSONB,
    "sports" JSONB,
    "languages" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "min_age" INTEGER,
    "max_age" INTEGER,
    "source_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "coach_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programs" (
    "id" TEXT NOT NULL,
    "facility_id" TEXT NOT NULL,
    "space_id" TEXT,
    "sport_id" TEXT NOT NULL,
    "coach_id" TEXT,
    "title" JSONB NOT NULL,
    "description" JSONB,
    "recurrence" JSONB,
    "min_age" INTEGER,
    "max_age" INTEGER,
    "capacity" INTEGER,
    "remaining_mirror" INTEGER,
    "source_url" TEXT,
    "source_confidence" "SourceConfidence" NOT NULL DEFAULT 'official_info',
    "sync_status" "SyncStatus" NOT NULL DEFAULT 'fresh',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offerings" (
    "id" TEXT NOT NULL,
    "facility_id" TEXT NOT NULL,
    "space_id" TEXT,
    "sport_id" TEXT NOT NULL,
    "coach_id" TEXT,
    "program_id" TEXT,
    "kind" "InventoryKind" NOT NULL,
    "title" JSONB NOT NULL,
    "description" JSONB,
    "min_age" INTEGER,
    "max_age" INTEGER,
    "capacity" INTEGER,
    "price_agorot" INTEGER,
    "source_url" TEXT,
    "source_confidence" "SourceConfidence" NOT NULL DEFAULT 'official_info',
    "sync_status" "SyncStatus" NOT NULL DEFAULT 'fresh',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "offerings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "open_matches" (
    "id" TEXT NOT NULL,
    "facility_id" TEXT NOT NULL,
    "space_id" TEXT NOT NULL,
    "sport_id" TEXT NOT NULL,
    "title" JSONB NOT NULL,
    "level" JSONB,
    "min_age" INTEGER,
    "max_age" INTEGER,
    "capacity" INTEGER NOT NULL,
    "confirmed_players" INTEGER NOT NULL DEFAULT 0,
    "starts_at" TIMESTAMPTZ(6) NOT NULL,
    "ends_at" TIMESTAMPTZ(6) NOT NULL,
    "safety_mode" TEXT NOT NULL DEFAULT 'templates_only',
    "status" TEXT NOT NULL DEFAULT 'open',
    "source_confidence" "SourceConfidence" NOT NULL DEFAULT 'official_info',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "open_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_follows" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "facility_id" TEXT,
    "coach_id" TEXT,
    "program_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waitlist_entries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "facility_id" TEXT NOT NULL,
    "program_id" TEXT,
    "slot_id" TEXT,
    "requested_age" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "waitlist_entries_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "inventory_resources"
  ADD COLUMN "offering_id" TEXT,
  ADD COLUMN "space_id" TEXT,
  ADD COLUMN "sport_id" TEXT;

-- AlterTable
ALTER TABLE "booking_slots"
  ADD COLUMN "offering_id" TEXT;

-- AlterTable
ALTER TABLE "booking_occupancies"
  ADD COLUMN "space_id" TEXT;

-- CreateIndex
CREATE INDEX "facility_spaces_facility_id_idx" ON "facility_spaces"("facility_id");

-- CreateIndex
CREATE UNIQUE INDEX "space_sport_capabilities_space_id_sport_id_key" ON "space_sport_capabilities"("space_id", "sport_id");

-- CreateIndex
CREATE INDEX "space_sport_capabilities_sport_id_idx" ON "space_sport_capabilities"("sport_id");

-- CreateIndex
CREATE INDEX "coach_profiles_facility_id_idx" ON "coach_profiles"("facility_id");

-- CreateIndex
CREATE INDEX "programs_facility_id_sport_id_idx" ON "programs"("facility_id", "sport_id");

-- CreateIndex
CREATE INDEX "programs_coach_id_idx" ON "programs"("coach_id");

-- CreateIndex
CREATE INDEX "programs_space_id_idx" ON "programs"("space_id");

-- CreateIndex
CREATE INDEX "offerings_facility_id_kind_idx" ON "offerings"("facility_id", "kind");

-- CreateIndex
CREATE INDEX "offerings_space_id_kind_idx" ON "offerings"("space_id", "kind");

-- CreateIndex
CREATE INDEX "offerings_sport_id_kind_idx" ON "offerings"("sport_id", "kind");

-- CreateIndex
CREATE INDEX "offerings_coach_id_idx" ON "offerings"("coach_id");

-- CreateIndex
CREATE INDEX "offerings_program_id_idx" ON "offerings"("program_id");

-- CreateIndex
CREATE INDEX "open_matches_facility_id_starts_at_idx" ON "open_matches"("facility_id", "starts_at");

-- CreateIndex
CREATE INDEX "open_matches_sport_id_starts_at_idx" ON "open_matches"("sport_id", "starts_at");

-- CreateIndex
CREATE INDEX "open_matches_space_id_starts_at_idx" ON "open_matches"("space_id", "starts_at");

-- CreateIndex
CREATE INDEX "user_follows_user_id_idx" ON "user_follows"("user_id");

-- CreateIndex
CREATE INDEX "user_follows_facility_id_idx" ON "user_follows"("facility_id");

-- CreateIndex
CREATE INDEX "user_follows_coach_id_idx" ON "user_follows"("coach_id");

-- CreateIndex
CREATE INDEX "user_follows_program_id_idx" ON "user_follows"("program_id");

-- CreateIndex
CREATE INDEX "waitlist_entries_user_id_status_idx" ON "waitlist_entries"("user_id", "status");

-- CreateIndex
CREATE INDEX "waitlist_entries_facility_id_status_idx" ON "waitlist_entries"("facility_id", "status");

-- CreateIndex
CREATE INDEX "waitlist_entries_program_id_status_idx" ON "waitlist_entries"("program_id", "status");

-- CreateIndex
CREATE INDEX "waitlist_entries_slot_id_status_idx" ON "waitlist_entries"("slot_id", "status");

-- CreateIndex
CREATE INDEX "inventory_resources_space_id_kind_idx" ON "inventory_resources"("space_id", "kind");

-- CreateIndex
CREATE INDEX "inventory_resources_sport_id_kind_idx" ON "inventory_resources"("sport_id", "kind");

-- CreateIndex
CREATE INDEX "inventory_resources_offering_id_idx" ON "inventory_resources"("offering_id");

-- CreateIndex
CREATE INDEX "booking_slots_offering_id_starts_at_idx" ON "booking_slots"("offering_id", "starts_at");

-- CreateIndex
CREATE INDEX "booking_occupancies_space_id_starts_at_idx" ON "booking_occupancies"("space_id", "starts_at");

-- AddForeignKey
ALTER TABLE "facility_spaces" ADD CONSTRAINT "facility_spaces_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space_sport_capabilities" ADD CONSTRAINT "space_sport_capabilities_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "facility_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space_sport_capabilities" ADD CONSTRAINT "space_sport_capabilities_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "sports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_profiles" ADD CONSTRAINT "coach_profiles_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "facility_spaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "sports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "coach_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offerings" ADD CONSTRAINT "offerings_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offerings" ADD CONSTRAINT "offerings_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "facility_spaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offerings" ADD CONSTRAINT "offerings_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "sports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offerings" ADD CONSTRAINT "offerings_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "coach_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offerings" ADD CONSTRAINT "offerings_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "open_matches" ADD CONSTRAINT "open_matches_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "open_matches" ADD CONSTRAINT "open_matches_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "facility_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "open_matches" ADD CONSTRAINT "open_matches_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "sports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "coach_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waitlist_entries" ADD CONSTRAINT "waitlist_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waitlist_entries" ADD CONSTRAINT "waitlist_entries_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waitlist_entries" ADD CONSTRAINT "waitlist_entries_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waitlist_entries" ADD CONSTRAINT "waitlist_entries_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "booking_slots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_resources" ADD CONSTRAINT "inventory_resources_offering_id_fkey" FOREIGN KEY ("offering_id") REFERENCES "offerings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_resources" ADD CONSTRAINT "inventory_resources_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "facility_spaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_resources" ADD CONSTRAINT "inventory_resources_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "sports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_slots" ADD CONSTRAINT "booking_slots_offering_id_fkey" FOREIGN KEY ("offering_id") REFERENCES "offerings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_occupancies" ADD CONSTRAINT "booking_occupancies_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "facility_spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Custom constraints Prisma cannot express.

ALTER TABLE "facility_spaces"
  ADD CONSTRAINT "facility_spaces_capacity_positive"
  CHECK ("capacity" IS NULL OR "capacity" > 0);

ALTER TABLE "offerings"
  ADD CONSTRAINT "offerings_capacity_positive"
  CHECK ("capacity" IS NULL OR "capacity" > 0);

ALTER TABLE "offerings"
  ADD CONSTRAINT "offerings_price_non_negative"
  CHECK ("price_agorot" IS NULL OR "price_agorot" >= 0);

ALTER TABLE "programs"
  ADD CONSTRAINT "programs_capacity_positive"
  CHECK ("capacity" IS NULL OR "capacity" > 0);

ALTER TABLE "open_matches"
  ADD CONSTRAINT "open_matches_positive_duration"
  CHECK ("ends_at" > "starts_at");

ALTER TABLE "open_matches"
  ADD CONSTRAINT "open_matches_capacity_valid"
  CHECK (
    "capacity" > 0
    AND "confirmed_players" >= 0
    AND "confirmed_players" <= "capacity"
  );

ALTER TABLE "user_follows"
  ADD CONSTRAINT "user_follows_has_target"
  CHECK ("facility_id" IS NOT NULL OR "coach_id" IS NOT NULL OR "program_id" IS NOT NULL);

ALTER TABLE "waitlist_entries"
  ADD CONSTRAINT "waitlist_entries_has_target"
  CHECK ("program_id" IS NOT NULL OR "slot_id" IS NOT NULL);

ALTER TABLE "booking_occupancies"
  ADD CONSTRAINT "booking_occupancies_no_space_exclusive_overlap"
  EXCLUDE USING gist (
    "space_id" WITH =,
    tstzrange("starts_at", "ends_at", '[)') WITH &&
  )
  WHERE (
    "space_id" IS NOT NULL
    AND "exclusive_use" = true
    AND "status" IN ('held', 'confirmed')
  );

CREATE INDEX "booking_occupancies_space_overlap_lookup"
  ON "booking_occupancies" ("space_id", "status")
  WHERE "space_id" IS NOT NULL AND "exclusive_use" = true AND "status" IN ('held', 'confirmed');
