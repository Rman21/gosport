import { Inject, Injectable } from "@nestjs/common";
import type { PaymentProvider } from "@sportil/payments";
import { PAYMENT_PROVIDER } from "../payments/payments.constants.js";
import {
  HoldStateConflictError,
  HoldNotFoundError,
  InventoryConflictError,
  SlotNotFoundError,
  SlotNotInstantBookableError,
} from "./booking-errors.js";
import type { AvailabilityAlternative, BookingRepository } from "./booking.repository.js";
import { BOOKING_REPOSITORY } from "./booking.repository.js";

const instantBookableConfidence = new Set(["manual_review", "operator_confirmed", "live_inventory"]);

@Injectable()
export class BookingsService {
  constructor(
    @Inject(BOOKING_REPOSITORY) private readonly bookingRepository: BookingRepository,
    @Inject(PAYMENT_PROVIDER) private readonly paymentProvider: PaymentProvider,
  ) {}

  async createHold(input: {
    idempotencyKey: string;
    participantsCount?: number;
    requestedUnits?: number;
    slotId: string;
    userId: string;
  }) {
    const slot = await this.bookingRepository.findSlotById(input.slotId);

    if (!slot) {
      throw new SlotNotFoundError(input.slotId);
    }

    if (!instantBookableConfidence.has(slot.sourceConfidence)) {
      throw new SlotNotInstantBookableError(input.slotId);
    }

    const requestedUnits = slot.exclusiveUse ? 1 : input.requestedUnits ?? 1;
    const participantsCount = input.participantsCount ?? requestedUnits;
    const amountAgorot = slot.amountAgorot * requestedUnits;
    const expiresAt = new Date(Date.now() + 6 * 60 * 1000);

    const paymentIntent = await this.paymentProvider.createIntent({
      amountAgorot,
      bookingHoldId: `${slot.id}:${input.idempotencyKey}`,
      currency: "ILS",
      idempotencyKey: `${input.idempotencyKey}:payment`,
      userId: input.userId,
    });

    const hold = await this.createRepositoryHoldWithAlternatives({
      amountAgorot,
      expiresAt,
      idempotencyKey: input.idempotencyKey,
      participantsCount,
      paymentIntentId: paymentIntent.id,
      providerIntentId: paymentIntent.providerIntentId,
      requestedUnits,
      slot,
      userId: input.userId,
    });

    return {
      data: {
        expiresAt: hold.expiresAt.toISOString(),
        holdId: hold.id,
        inventory: {
          exclusiveUse: slot.exclusiveUse,
          inventoryKind: slot.inventoryKind,
          participantsCount: hold.participantsCount,
          requestedUnits: hold.requestedUnits,
        },
        paymentIntent,
        slot: {
          endsAt: slot.endsAt.toISOString(),
          id: slot.id,
          startsAt: slot.startsAt.toISOString(),
          title: slot.title,
        },
        status: hold.status,
      },
    };
  }

  async confirmHold(input: {
    holdId: string;
    idempotencyKey: string;
    providerIntentId: string;
  }) {
    const hold = await this.bookingRepository.findHoldById(input.holdId);

    if (!hold) {
      throw new HoldNotFoundError(input.holdId);
    }

    if (hold.status !== "held" || hold.expiresAt.getTime() <= Date.now()) {
      throw new HoldStateConflictError();
    }

    const paymentEvent = await this.paymentProvider.confirmIntent({
      idempotencyKey: `${input.idempotencyKey}:confirm-payment`,
      providerIntentId: input.providerIntentId,
    });

    const booking = await this.bookingRepository.confirmHold({
      holdId: input.holdId,
      idempotencyKey: input.idempotencyKey,
      paymentEventId: paymentEvent.providerEventId,
      providerIntentId: input.providerIntentId,
    });
    const referenceSeed = booking.id.replace(/[^a-z0-9]/gi, "").slice(-8).toUpperCase();

    return {
      data: {
        bookingId: booking.id,
        confirmedAt: booking.confirmedAt.toISOString(),
        paymentEvent,
        reference: `SPIL-${referenceSeed}`,
        slotId: booking.slotId,
        status: "confirmed",
      },
    };
  }

  async getSlotAlternatives(input: { requestedUnits?: number; slotId: string; userAge?: number }) {
    const alternatives = await this.bookingRepository.findNearestAlternatives({
      limit: 4,
      slotId: input.slotId,
      ...(input.requestedUnits === undefined ? {} : { requestedUnits: input.requestedUnits }),
      ...(input.userAge === undefined ? {} : { userAge: input.userAge }),
    });

    return {
      data: {
        alternatives: alternatives.map((alternative) => this.toApiAlternative(alternative)),
        slotId: input.slotId,
      },
    };
  }

  async listUserBookings(userId: string) {
    const items = await this.bookingRepository.listUserActivity(userId);

    return {
      data: {
        items: items.map((item) => ({
          createdAt: item.createdAt.toISOString(),
          endsAt: item.endsAt.toISOString(),
          facility: {
            id: item.facilityId,
            name: item.facilityName,
          },
          id: item.id,
          kind: item.kind,
          ...(item.reference ? { reference: item.reference } : {}),
          slotId: item.slotId,
          startsAt: item.startsAt.toISOString(),
          status: item.status,
          title: item.title,
        })),
      },
    };
  }

  private async createRepositoryHoldWithAlternatives(
    input: Parameters<BookingRepository["createHold"]>[0],
  ) {
    try {
      return await this.bookingRepository.createHold(input);
    } catch (error) {
      if (!(error instanceof InventoryConflictError)) {
        throw error;
      }

      const alternatives = await this.bookingRepository.findNearestAlternatives({
        limit: 4,
        requestedUnits: input.requestedUnits,
        slotId: input.slot.id,
      });

      throw new InventoryConflictError(
        "The selected time is unavailable. Try one of the nearest available options.",
        alternatives.map((alternative) => this.toApiAlternative(alternative)),
      );
    }
  }

  private toApiAlternative(alternative: AvailabilityAlternative) {
    return {
      availableUnits: alternative.availableUnits,
      endsAt: alternative.slot.endsAt.toISOString(),
      reason: alternative.reason,
      slotId: alternative.slot.id,
      startsAt: alternative.slot.startsAt.toISOString(),
      title: alternative.slot.title,
    };
  }
}
