-- Add resident profile fields and protect saved-item idempotency.

-- AlterTable
ALTER TABLE "user_accounts"
  ADD COLUMN "preferred_locale" TEXT NOT NULL DEFAULT 'ru',
  ADD COLUMN "contact_phone" TEXT,
  ADD COLUMN "family_members" JSONB,
  ADD COLUMN "favorite_sports" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Create partial unique indexes because saved targets are nullable and independent.
CREATE UNIQUE INDEX "user_follows_unique_facility_follow_idx"
  ON "user_follows"("user_id", "facility_id")
  WHERE "facility_id" IS NOT NULL;

CREATE UNIQUE INDEX "user_follows_unique_coach_follow_idx"
  ON "user_follows"("user_id", "coach_id")
  WHERE "coach_id" IS NOT NULL;

CREATE UNIQUE INDEX "user_follows_unique_program_follow_idx"
  ON "user_follows"("user_id", "program_id")
  WHERE "program_id" IS NOT NULL;
