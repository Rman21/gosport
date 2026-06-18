ALTER TABLE "booking_holds"
  ADD COLUMN "participants_count" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "booking_holds"
  ADD CONSTRAINT "booking_holds_participants_count_positive"
  CHECK ("participants_count" > 0);
