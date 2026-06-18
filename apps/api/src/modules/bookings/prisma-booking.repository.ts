import { Injectable } from "@nestjs/common";
import { bookingOverlapConstraintNames, prisma } from "@sportil/db";
import { Prisma, type BookingSlot, type InventoryResource } from "@prisma/client";
import type {
  AvailabilityAlternative,
  BookableSlot,
  BookingActivityItem,
  BookingRecord,
  BookingRepository,
  HoldRecord,
  LocalizedPayload,
} from "./booking.repository.js";
import { HoldStateConflictError, InventoryConflictError } from "./booking-errors.js";

const instantBookableConfidence = ["manual_review", "operator_confirmed", "live_inventory"] as const;

type SlotWithResource = BookingSlot & {
  capacityRow: {
    capacity: number;
    confirmedUnits: number;
    heldUnits: number;
  } | null;
  resource: InventoryResource;
};

const holdInclude = {
  paymentIntent: true,
  slot: {
    include: {
      capacityRow: true,
      resource: true,
    },
  },
} satisfies Prisma.BookingHoldInclude;

const bookingInclude = {
  hold: true,
  paymentIntent: {
    include: {
      events: {
        orderBy: {
          receivedAt: "desc",
        },
        take: 1,
      },
    },
  },
} satisfies Prisma.BookingInclude;

const activitySlotInclude = {
  resource: {
    include: {
      facility: {
        select: {
          id: true,
          name: true,
          neighborhood: true,
        },
      },
    },
  },
} satisfies Prisma.BookingSlotInclude;

function localizedTitle(value: Prisma.JsonValue) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const maybeText = value as Record<string, unknown>;
    const english = maybeText.en;
    const russian = maybeText.ru;
    const hebrew = maybeText.he;

    if (typeof english === "string") {
      return english;
    }

    if (typeof russian === "string") {
      return russian;
    }

    if (typeof hebrew === "string") {
      return hebrew;
    }
  }

  return "SportIL booking slot";
}

function localizedPayload(value: Prisma.JsonValue | null | undefined, fallback: string): LocalizedPayload {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const maybeText = value as Record<string, unknown>;
    const en = typeof maybeText.en === "string" ? maybeText.en : fallback;
    const he = typeof maybeText.he === "string" ? maybeText.he : en;
    const ru = typeof maybeText.ru === "string" ? maybeText.ru : en;

    return { en, he, ru };
  }

  return { en: fallback, he: fallback, ru: fallback };
}

function bookingReference(id: string) {
  return `SPIL-${id.replace(/[^a-z0-9]/gi, "").slice(-8).toUpperCase()}`;
}

function mapSlot(slot: SlotWithResource): BookableSlot {
  const capacity = slot.capacityRow?.capacity ?? slot.capacity;
  const remainingUnits =
    slot.capacityRow === null
      ? (slot.remainingMirror ?? capacity)
      : Math.max(0, slot.capacityRow.capacity - slot.capacityRow.heldUnits - slot.capacityRow.confirmedUnits);

  return {
    amountAgorot: slot.priceAgorot ?? 0,
    capacity,
    endsAt: slot.endsAt,
    exclusiveUse: slot.resource.exclusiveUse,
    facilityId: slot.resource.facilityId,
    id: slot.id,
    inventoryKind: slot.resource.kind,
    ...(slot.resource.maxAge === null ? {} : { maxAge: slot.resource.maxAge }),
    ...(slot.resource.minAge === null ? {} : { minAge: slot.resource.minAge }),
    remainingUnits,
    resourceId: slot.resourceId,
    ...(slot.resource.spaceId === null ? {} : { spaceId: slot.resource.spaceId }),
    sourceConfidence: slot.sourceConfidence,
    startsAt: slot.startsAt,
    title: localizedTitle(slot.title),
  };
}

function mapHold(
  hold: Prisma.BookingHoldGetPayload<{ include: typeof holdInclude }>,
): HoldRecord {
  if (!hold.paymentIntent) {
    throw new HoldStateConflictError("Payment intent is missing for this hold");
  }

  return {
    amountAgorot: hold.paymentIntent.amountAgorot,
    expiresAt: hold.expiresAt,
    id: hold.id,
    idempotencyKey: hold.idempotencyKey,
    participantsCount: hold.participantsCount,
    paymentIntentId: hold.paymentIntent.id,
    providerIntentId: hold.paymentIntent.providerIntentId,
    requestedUnits: hold.requestedUnits,
    slot: mapSlot(hold.slot),
    status: hold.status,
    userId: hold.userId,
  };
}

function mapBooking(
  booking: Prisma.BookingGetPayload<{ include: typeof bookingInclude }>,
): BookingRecord {
  const latestPaymentEvent = booking.paymentIntent?.events[0];

  return {
    confirmedAt: booking.confirmedAt,
    holdId: booking.holdId,
    id: booking.id,
    idempotencyKey: booking.idempotencyKey,
    paymentEventId: latestPaymentEvent?.providerEventId ?? "",
    slotId: booking.slotId,
    userId: booking.userId,
  };
}

function isOverlapConstraintError(error: unknown) {
  return error instanceof Error && bookingOverlapConstraintNames.some((name) => error.message.includes(name));
}

function ageMatches(slot: BookableSlot, userAge?: number) {
  if (userAge === undefined) {
    return true;
  }

  return userAge >= (slot.minAge ?? 0) && userAge <= (slot.maxAge ?? 99);
}

function getAlternativeReason(source: BookableSlot, candidate: BookableSlot): AvailabilityAlternative["reason"] {
  if (candidate.startsAt.toDateString() === source.startsAt.toDateString()) {
    return "nearest_time";
  }

  if (candidate.resourceId === source.resourceId) {
    return "same_program";
  }

  return "nearest_day";
}

@Injectable()
export class PrismaBookingRepository implements BookingRepository {
  async confirmHold(input: {
    holdId: string;
    idempotencyKey: string;
    paymentEventId: string;
    providerIntentId: string;
  }): Promise<BookingRecord> {
    return prisma.$transaction(async (tx) => {
      await this.releaseExpiredHolds(tx, new Date());

      const existingBooking = await tx.booking.findUnique({
        include: bookingInclude,
        where: { idempotencyKey: input.idempotencyKey },
      });

      if (existingBooking) {
        return mapBooking(existingBooking);
      }

      await tx.$queryRaw`SELECT id FROM booking_holds WHERE id = ${input.holdId} FOR UPDATE`;

      const hold = await tx.bookingHold.findUnique({
        include: holdInclude,
        where: { id: input.holdId },
      });

      if (!hold || !hold.paymentIntent) {
        throw new HoldStateConflictError("Hold or payment intent was not found");
      }

      if (hold.paymentIntent.providerIntentId !== input.providerIntentId) {
        throw new HoldStateConflictError("Payment intent does not match this hold");
      }

      if (hold.status !== "held" || hold.expiresAt.getTime() <= Date.now()) {
        throw new HoldStateConflictError();
      }

      await tx.$queryRaw`SELECT slot_id FROM slot_capacities WHERE slot_id = ${hold.slotId} FOR UPDATE`;

      const booking = await tx.booking.create({
        data: {
          holdId: hold.id,
          idempotencyKey: input.idempotencyKey,
          slotId: hold.slotId,
          status: "confirmed",
          userId: hold.userId,
        },
      });

      await tx.bookingHold.update({
        data: { status: "converted" },
        where: { id: hold.id },
      });

      await tx.bookingOccupancy.updateMany({
        data: {
          bookingId: booking.id,
          status: "confirmed",
        },
        where: {
          holdId: hold.id,
          status: "held",
        },
      });

      await tx.slotCapacity.update({
        data: {
          confirmedUnits: { increment: hold.requestedUnits },
          heldUnits: { decrement: hold.requestedUnits },
        },
        where: { slotId: hold.slotId },
      });

      const paymentIntent = await tx.paymentIntent.update({
        data: {
          bookingId: booking.id,
          status: "succeeded",
        },
        where: { holdId: hold.id },
      });

      await tx.paymentEvent.create({
        data: {
          eventType: "payment_intent.succeeded",
          payloadRedacted: {
            livemode: false,
            providerIntentId: input.providerIntentId,
            source: "mock_payment_adapter",
          },
          paymentIntentId: paymentIntent.id,
          providerEventId: input.paymentEventId,
        },
      });

      await tx.auditEvent.create({
        data: {
          action: "booking.confirmed",
          actorRole: "resident",
          actorUserId: hold.userId,
          idempotencyKey: input.idempotencyKey,
          metadata: {
            providerIntentId: input.providerIntentId,
            slotId: hold.slotId,
          },
          subjectId: booking.id,
          subjectType: "booking",
        },
      });

      return {
        confirmedAt: booking.confirmedAt,
        holdId: booking.holdId,
        id: booking.id,
        idempotencyKey: booking.idempotencyKey,
        paymentEventId: input.paymentEventId,
        slotId: booking.slotId,
        userId: booking.userId,
      };
    });
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
    try {
      return await prisma.$transaction(async (tx) => {
        await this.releaseExpiredHolds(tx, new Date());

        const existingHold = await tx.bookingHold.findUnique({
          include: holdInclude,
          where: { idempotencyKey: input.idempotencyKey },
        });

        if (existingHold) {
          return mapHold(existingHold);
        }

        await tx.userAccount.upsert({
          create: {
            id: input.userId,
            name: {
              en: "SportIL resident",
              he: "תושב SportIL",
              ru: "Житель SportIL",
            },
            role: "resident",
          },
          update: {},
          where: { id: input.userId },
        });

        await tx.$queryRaw`SELECT slot_id FROM slot_capacities WHERE slot_id = ${input.slot.id} FOR UPDATE`;

        const capacityRow = await tx.slotCapacity.findUnique({
          where: { slotId: input.slot.id },
        });

        if (!capacityRow) {
          throw new InventoryConflictError("This slot is missing capacity data");
        }

        if (input.slot.exclusiveUse && input.requestedUnits !== 1) {
          throw new InventoryConflictError("Court rental reserves one court, not participant seats");
        }

        const availableUnits = capacityRow.capacity - capacityRow.heldUnits - capacityRow.confirmedUnits;

        if (availableUnits < input.requestedUnits) {
          throw new InventoryConflictError("The requested time is no longer available");
        }

        const hold = await tx.bookingHold.create({
          data: {
            expiresAt: input.expiresAt,
            idempotencyKey: input.idempotencyKey,
            participantsCount: input.participantsCount,
            paymentIntent: {
              create: {
                amountAgorot: input.amountAgorot,
                currency: "ILS",
                id: input.paymentIntentId,
                idempotencyKey: `${input.idempotencyKey}:payment`,
                provider: "sportil_mock",
                providerIntentId: input.providerIntentId,
                redactedMethod: {
                  brand: "mock-visa",
                  expLabel: "12/30",
                  label: "Mock Visa 4242",
                  last4: "4242",
                },
                status: "requires_confirmation",
              },
            },
            requestedUnits: input.requestedUnits,
            slotId: input.slot.id,
            status: "held",
            userId: input.userId,
          },
          include: holdInclude,
        });

        await tx.bookingOccupancy.create({
          data: {
            claimedUnits: input.requestedUnits,
            endsAt: input.slot.endsAt,
            exclusiveUse: input.slot.exclusiveUse,
            holdId: hold.id,
            resourceId: input.slot.resourceId,
            ...(input.slot.spaceId === undefined ? {} : { spaceId: input.slot.spaceId }),
            slotId: input.slot.id,
            startsAt: input.slot.startsAt,
            status: "held",
          },
        });

        await tx.slotCapacity.update({
          data: {
            heldUnits: { increment: input.requestedUnits },
          },
          where: { slotId: input.slot.id },
        });

        await tx.auditEvent.create({
          data: {
            action: "booking_hold.created",
            actorRole: "resident",
            actorUserId: input.userId,
            idempotencyKey: input.idempotencyKey,
            metadata: {
              expiresAt: input.expiresAt.toISOString(),
              requestedUnits: input.requestedUnits,
              slotId: input.slot.id,
            },
            subjectId: hold.id,
            subjectType: "booking_hold",
          },
        });

        return mapHold(hold);
      });
    } catch (error) {
      if (isOverlapConstraintError(error)) {
        throw new InventoryConflictError("The selected court overlaps with another active hold");
      }

      throw error;
    }
  }

  async findHoldById(holdId: string) {
    const hold = await prisma.bookingHold.findUnique({
      include: holdInclude,
      where: { id: holdId },
    });

    return hold ? mapHold(hold) : undefined;
  }

  async findHoldByIdempotencyKey(idempotencyKey: string) {
    const hold = await prisma.bookingHold.findUnique({
      include: holdInclude,
      where: { idempotencyKey },
    });

    return hold ? mapHold(hold) : undefined;
  }

  async findNearestAlternatives(input: {
    limit?: number;
    requestedUnits?: number;
    slotId: string;
    userAge?: number;
  }): Promise<AvailabilityAlternative[]> {
    const requestedUnits = input.requestedUnits ?? 1;
    const limit = input.limit ?? 3;
    const source = await this.findSlotById(input.slotId);

    if (!source) {
      return [];
    }

    const candidates = await prisma.bookingSlot.findMany({
      include: {
        capacityRow: true,
        resource: true,
      },
      orderBy: {
        startsAt: "asc",
      },
      take: limit * 4,
      where: {
        id: {
          not: source.id,
        },
        resource: {
          is: {
            facilityId: source.facilityId,
            kind: source.inventoryKind,
          },
        },
        startsAt: {
          gte: source.startsAt,
        },
        sourceConfidence: {
          in: [...instantBookableConfidence],
        },
        syncStatus: "fresh",
      },
    });

    return candidates
      .map((slot) => mapSlot(slot))
      .filter((slot) => slot.remainingUnits >= requestedUnits)
      .filter((slot) => ageMatches(slot, input.userAge))
      .slice(0, limit)
      .map((slot) => ({
        availableUnits: slot.remainingUnits,
        reason: getAlternativeReason(source, slot),
        slot,
      }));
  }

  async findSlotById(slotId: string) {
    const slot = await prisma.bookingSlot.findUnique({
      include: {
        capacityRow: true,
        resource: true,
      },
      where: { id: slotId },
    });

    return slot ? mapSlot(slot) : undefined;
  }

  async listUserActivity(userId: string): Promise<BookingActivityItem[]> {
    return prisma.$transaction(async (tx) => {
      await this.releaseExpiredHolds(tx, new Date());

      const [holds, bookings] = await Promise.all([
        tx.bookingHold.findMany({
          include: {
            slot: {
              include: activitySlotInclude,
            },
          },
          orderBy: { createdAt: "desc" },
          take: 50,
          where: {
            status: {
              not: "converted",
            },
            userId,
          },
        }),
        tx.booking.findMany({
          include: {
            slot: {
              include: activitySlotInclude,
            },
          },
          orderBy: { confirmedAt: "desc" },
          take: 50,
          where: { userId },
        }),
      ]);

      const holdItems = holds.map((hold): BookingActivityItem => ({
        createdAt: hold.createdAt,
        endsAt: hold.slot.endsAt,
        facilityId: hold.slot.resource.facility.id,
        facilityName: localizedPayload(hold.slot.resource.facility.name, "SportIL facility"),
        id: hold.id,
        kind: "hold",
        slotId: hold.slotId,
        startsAt: hold.slot.startsAt,
        status: hold.status === "converted" ? "released" : hold.status,
        title: localizedPayload(hold.slot.title, localizedTitle(hold.slot.title)),
      }));

      const bookingItems = bookings.map((booking): BookingActivityItem => ({
        createdAt: booking.confirmedAt,
        endsAt: booking.slot.endsAt,
        facilityId: booking.slot.resource.facility.id,
        facilityName: localizedPayload(booking.slot.resource.facility.name, "SportIL facility"),
        id: booking.id,
        kind: "booking",
        reference: bookingReference(booking.id),
        slotId: booking.slotId,
        startsAt: booking.slot.startsAt,
        status: booking.status,
        title: localizedPayload(booking.slot.title, localizedTitle(booking.slot.title)),
      }));

      return [...holdItems, ...bookingItems]
        .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())
        .slice(0, 80);
    });
  }

  private async releaseExpiredHolds(tx: Prisma.TransactionClient, now: Date) {
    const lockedExpiredHolds = await tx.$queryRaw<Array<{ id: string }>>`
      SELECT id
      FROM booking_holds
      WHERE status = 'held' AND expires_at <= ${now}
      FOR UPDATE
    `;
    const expiredHoldIds = lockedExpiredHolds.map((hold) => hold.id);

    if (expiredHoldIds.length === 0) {
      return;
    }

    const expiredHolds = await tx.bookingHold.findMany({
      select: {
        id: true,
        requestedUnits: true,
        slotId: true,
      },
      where: {
        id: { in: expiredHoldIds },
      },
    });

    if (expiredHolds.length === 0) {
      return;
    }

    const slotIds = [...new Set(expiredHolds.map((hold) => hold.slotId))];

    await tx.$queryRaw`SELECT slot_id FROM slot_capacities WHERE slot_id IN (${Prisma.join(slotIds)}) FOR UPDATE`;

    await tx.bookingHold.updateMany({
      data: { status: "expired" },
      where: { id: { in: expiredHolds.map((hold) => hold.id) } },
    });

    await tx.bookingOccupancy.updateMany({
      data: { status: "expired" },
      where: {
        holdId: { in: expiredHolds.map((hold) => hold.id) },
        status: "held",
      },
    });

    for (const slotId of slotIds) {
      const releasedUnits = expiredHolds
        .filter((hold) => hold.slotId === slotId)
        .reduce((sum, hold) => sum + hold.requestedUnits, 0);

      await tx.slotCapacity.update({
        data: {
          heldUnits: { decrement: releasedUnits },
        },
        where: { slotId },
      });
    }
  }
}
