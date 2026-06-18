import { Injectable } from "@nestjs/common";
import type {
  BookableSlot,
  BookingActivityItem,
  BookingRecord,
  BookingRepository,
  HoldRecord,
} from "./booking.repository.js";
import { HoldStateConflictError, InventoryConflictError } from "./booking-errors.js";

const demoSlots: BookableSlot[] = [
  {
    amountAgorot: 4500,
    capacity: 1,
    endsAt: new Date("2026-06-18T16:30:00.000Z"),
    exclusiveUse: true,
    facilityId: "gali-yam-tennis",
    id: "gali-yam-demo-adult-court",
    inventoryKind: "court_rental",
    maxAge: 99,
    minAge: 18,
    remainingUnits: 1,
    resourceId: "gali-yam-court-01",
    spaceId: "gali-yam-court-01-space",
    sourceConfidence: "manual_review",
    startsAt: new Date("2026-06-18T15:30:00.000Z"),
    title: "Gali Yam 60-minute court rental",
  },
  {
    amountAgorot: 22500,
    capacity: 18,
    endsAt: new Date("2026-06-23T13:45:00.000Z"),
    exclusiveUse: false,
    facilityId: "yeshurun-basketball",
    id: "yeshurun-girls-basketball",
    inventoryKind: "group_class",
    maxAge: 12,
    minAge: 7,
    remainingUnits: 5,
    resourceId: "yeshurun-girls-basketball-resource",
    spaceId: "yeshurun-main-hall",
    sourceConfidence: "operator_confirmed",
    startsAt: new Date("2026-06-23T13:00:00.000Z"),
    title: "Yeshurun girls basketball class",
  },
];

@Injectable()
export class InMemoryBookingRepository implements BookingRepository {
  private readonly bookings = new Map<string, BookingRecord>();
  private readonly holds = new Map<string, HoldRecord>();
  private readonly slots = new Map(demoSlots.map((slot) => [slot.id, slot]));

  confirmHold(input: {
    holdId: string;
    idempotencyKey: string;
    paymentEventId: string;
    providerIntentId: string;
  }): Promise<BookingRecord> {
    const existing = [...this.bookings.values()].find(
      (booking) => booking.idempotencyKey === input.idempotencyKey,
    );

    if (existing) {
      return Promise.resolve(existing);
    }

    const hold = this.holds.get(input.holdId);

    if (!hold || hold.providerIntentId !== input.providerIntentId) {
      throw new HoldStateConflictError("Payment intent does not match this hold");
    }

    if (hold.status !== "held" || hold.expiresAt.getTime() <= Date.now()) {
      throw new HoldStateConflictError();
    }

    hold.status = "converted";

    const booking: BookingRecord = {
      confirmedAt: new Date(),
      holdId: hold.id,
      id: `booking_${hold.id}`,
      idempotencyKey: input.idempotencyKey,
      paymentEventId: input.paymentEventId,
      slotId: hold.slot.id,
      userId: hold.userId,
    };

    this.bookings.set(booking.id, booking);
    return Promise.resolve(booking);
  }

  async createHold(input: {
    amountAgorot: number;
    expiresAt: Date;
    idempotencyKey: string;
    participantsCount: number;
    paymentIntentId: string;
    providerIntentId: string;
    requestedUnits: number;
    slot: BookableSlot;
    userId: string;
  }): Promise<HoldRecord> {
    const existing = await this.findHoldByIdempotencyKey(input.idempotencyKey);

    if (existing) {
      return existing;
    }

    this.assertCapacity(input.slot, input.requestedUnits);

    const hold: HoldRecord = {
      amountAgorot: input.amountAgorot,
      expiresAt: input.expiresAt,
      id: `hold_${input.slot.id}_${this.holds.size + 1}`,
      idempotencyKey: input.idempotencyKey,
      participantsCount: input.participantsCount,
      paymentIntentId: input.paymentIntentId,
      providerIntentId: input.providerIntentId,
      requestedUnits: input.requestedUnits,
      slot: input.slot,
      status: "held",
      userId: input.userId,
    };

    this.holds.set(hold.id, hold);
    return hold;
  }

  findHoldById(holdId: string) {
    return Promise.resolve(this.holds.get(holdId));
  }

  findHoldByIdempotencyKey(idempotencyKey: string) {
    return Promise.resolve(
      [...this.holds.values()].find((hold) => hold.idempotencyKey === idempotencyKey),
    );
  }

  findNearestAlternatives(input: { limit?: number; requestedUnits?: number; slotId: string; userAge?: number }) {
    const requestedUnits = input.requestedUnits ?? 1;
    const sourceSlot = this.slots.get(input.slotId);

    if (!sourceSlot) {
      return Promise.resolve([]);
    }

    return Promise.resolve(
      [...this.slots.values()]
        .filter((slot) => slot.id !== sourceSlot.id)
        .filter((slot) => slot.facilityId === sourceSlot.facilityId)
        .filter((slot) => slot.inventoryKind === sourceSlot.inventoryKind)
        .filter((slot) => slot.remainingUnits >= requestedUnits)
        .slice(0, input.limit ?? 3)
        .map((slot) => ({
          availableUnits: slot.remainingUnits,
          reason: "same_program" as const,
          slot,
        })),
    );
  }

  findSlotById(slotId: string) {
    return Promise.resolve(this.slots.get(slotId));
  }

  listUserActivity(userId: string): Promise<BookingActivityItem[]> {
    const holds = [...this.holds.values()]
      .filter((hold) => hold.userId === userId && hold.status !== "converted")
      .map((hold): BookingActivityItem => ({
        createdAt: hold.expiresAt,
        endsAt: hold.slot.endsAt,
        facilityId: hold.slot.facilityId,
        facilityName: {
          en: "SportIL facility",
          he: "מתקן SportIL",
          ru: "Объект SportIL",
        },
        id: hold.id,
        kind: "hold",
        slotId: hold.slot.id,
        startsAt: hold.slot.startsAt,
        status:
          hold.status === "converted"
            ? "released"
            : hold.status === "held" && hold.expiresAt.getTime() <= Date.now()
              ? "expired"
              : hold.status,
        title: {
          en: hold.slot.title,
          he: hold.slot.title,
          ru: hold.slot.title,
        },
      }));

    const bookings = [...this.bookings.values()]
      .filter((booking) => booking.userId === userId)
      .map((booking): BookingActivityItem => {
        const slot = this.slots.get(booking.slotId) ?? demoSlots[0]!;

        return {
          createdAt: booking.confirmedAt,
          endsAt: slot.endsAt,
          facilityId: slot.facilityId,
          facilityName: {
            en: "SportIL facility",
            he: "מתקן SportIL",
            ru: "Объект SportIL",
          },
          id: booking.id,
          kind: "booking",
          reference: `SPIL-${booking.id.replace(/[^a-z0-9]/gi, "").slice(-8).toUpperCase()}`,
          slotId: slot.id,
          startsAt: slot.startsAt,
          status: "confirmed",
          title: {
            en: slot.title,
            he: slot.title,
            ru: slot.title,
          },
        };
      });

    return Promise.resolve(
      [...holds, ...bookings].sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime()),
    );
  }

  private assertCapacity(slot: BookableSlot, requestedUnits: number) {
    const activeHolds = [...this.holds.values()].filter(
      (hold) =>
        hold.slot.id === slot.id &&
        hold.status === "held" &&
        hold.expiresAt.getTime() > Date.now(),
    );

    if (slot.exclusiveUse && activeHolds.length > 0) {
      throw new InventoryConflictError("This court is already held");
    }

    if (slot.exclusiveUse && requestedUnits !== 1) {
      throw new InventoryConflictError("Court rental reserves one court, not participant seats");
    }

    const heldUnits = activeHolds.reduce((sum, hold) => sum + hold.requestedUnits, 0);

    if (!slot.exclusiveUse && heldUnits + requestedUnits > slot.capacity) {
      throw new InventoryConflictError("This class does not have enough seats left");
    }
  }
}
