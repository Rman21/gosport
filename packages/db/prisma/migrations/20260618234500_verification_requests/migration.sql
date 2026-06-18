-- Store resident-submitted requests separately from operator verification tasks.
-- These records back the resident mini-account and the admin triage queue.

-- CreateEnum
CREATE TYPE "VerificationRequestKind" AS ENUM (
    'availability_request',
    'report_wrong_info',
    'claim_facility',
    'request_online_booking'
);

-- CreateEnum
CREATE TYPE "VerificationRequestStatus" AS ENUM (
    'submitted',
    'triaged',
    'in_progress',
    'resolved',
    'rejected'
);

-- CreateTable
CREATE TABLE "verification_requests" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "facility_id" TEXT,
    "kind" "VerificationRequestKind" NOT NULL,
    "status" "VerificationRequestStatus" NOT NULL DEFAULT 'submitted',
    "preferred_locale" TEXT NOT NULL DEFAULT 'ru',
    "resident_name" TEXT,
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "message" TEXT,
    "idempotency_key" TEXT,
    "payload_redacted" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "verification_requests_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "verification_requests_has_content_check" CHECK (
        "message" IS NOT NULL
        OR "contact_email" IS NOT NULL
        OR "contact_phone" IS NOT NULL
        OR "resident_name" IS NOT NULL
    )
);

-- CreateIndex
CREATE UNIQUE INDEX "verification_requests_idempotency_key_key" ON "verification_requests"("idempotency_key");

-- CreateIndex
CREATE INDEX "verification_requests_user_id_status_idx" ON "verification_requests"("user_id", "status");

-- CreateIndex
CREATE INDEX "verification_requests_facility_id_status_idx" ON "verification_requests"("facility_id", "status");

-- CreateIndex
CREATE INDEX "verification_requests_kind_status_idx" ON "verification_requests"("kind", "status");

-- CreateIndex
CREATE INDEX "verification_requests_created_at_idx" ON "verification_requests"("created_at");

-- AddForeignKey
ALTER TABLE "verification_requests" ADD CONSTRAINT "verification_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_requests" ADD CONSTRAINT "verification_requests_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
