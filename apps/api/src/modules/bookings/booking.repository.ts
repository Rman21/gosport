export type InventoryKind = "coach_session" | "court_rental" | "group_class" | "open_play";

export type BookableSlot = {
  amountAgorot: number;
  capacity: number;
  endsAt: Date;
  exclusiveUse: boolean;
  facilityId: string;
  id: string;
  inventoryKind: InventoryKind;
  maxAge?: number;
  minAge?: number;
  remainingUnits: number;
  resourceId: string;
  spaceId?: string;
  sourceConfidence: "live_inventory" | "manual_review" | "official_info" | "operator_confirmed";
  startsAt: Date;
  title: string;
};

export type HoldRecord = {
  amountAgorot: number;
  expiresAt: Date;
  id: string;
  idempotencyKey: string;
  participantsCount: number;
  paymentIntentId: string;
  providerIntentId: string;
  requestedUnits: number;
  slot: BookableSlot;
  status: "converted" | "expired" | "held" | "released";
  userId: string;
};

export type BookingRecord = {
  confirmedAt: Date;
  holdId: string;
  id: string;
  idempotencyKey: string;
  paymentEventId: string;
  slotId: string;
  userId: string;
};

export type AvailabilityAlternative = {
  availableUnits: number;
  reason: "nearest_day" | "nearest_time" | "same_program";
  slot: BookableSlot;
};

export type LocalizedPayload = {
  en: string;
  he: string;
  ru: string;
};

export type BookingActivityItem = {
  createdAt: Date;
  endsAt: Date;
  facilityId: string;
  facilityName: LocalizedPayload;
  id: string;
  kind: "booking" | "hold";
  reference?: string;
  slotId: string;
  startsAt: Date;
  status: "cancelled" | "confirmed" | "expired" | "held" | "refunded" | "released";
  title: LocalizedPayload;
};

export const BOOKING_REPOSITORY = Symbol("BOOKING_REPOSITORY");

export interface BookingRepository {
  confirmHold(input: {
    holdId: string;
    idempotencyKey: string;
    paymentEventId: string;
    providerIntentId: string;
  }): Promise<BookingRecord>;
  createHold(input: {
    amountAgorot: number;
    expiresAt: Date;
    idempotencyKey: string;
    participantsCount: number;
    paymentIntentId: string;
    providerIntentId: string;
    requestedUnits: number;
    slot: BookableSlot;
    userId: string;
  }): Promise<HoldRecord>;
  findHoldById(holdId: string): Promise<HoldRecord | undefined>;
  findHoldByIdempotencyKey(idempotencyKey: string): Promise<HoldRecord | undefined>;
  findNearestAlternatives(input: {
    limit?: number;
    requestedUnits?: number;
    slotId: string;
    userAge?: number;
  }): Promise<AvailabilityAlternative[]>;
  findSlotById(slotId: string): Promise<BookableSlot | undefined>;
  listUserActivity(userId: string): Promise<BookingActivityItem[]>;
}
