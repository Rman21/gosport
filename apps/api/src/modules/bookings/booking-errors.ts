import { ConflictException, NotFoundException, UnprocessableEntityException } from "@nestjs/common";

export type BookingErrorAlternative = {
  availableUnits: number;
  endsAt: string;
  reason: "nearest_day" | "nearest_time" | "same_program";
  slotId: string;
  startsAt: string;
  title: string;
};

export class SlotNotFoundError extends NotFoundException {
  constructor(slotId: string) {
    super({
      code: "slot_not_found",
      message: `Slot ${slotId} was not found`,
    });
  }
}

export class HoldNotFoundError extends NotFoundException {
  constructor(holdId: string) {
    super({
      code: "hold_not_found",
      message: `Hold ${holdId} was not found`,
    });
  }
}

export class SlotNotInstantBookableError extends UnprocessableEntityException {
  constructor(slotId: string) {
    super({
      code: "slot_not_instant_bookable",
      message: `Slot ${slotId} is not eligible for instant booking`,
    });
  }
}

export class InventoryConflictError extends ConflictException {
  constructor(message = "The slot is no longer available", alternatives: BookingErrorAlternative[] = []) {
    super({
      alternatives,
      code: "inventory_conflict",
      message,
    });
  }
}

export class HoldStateConflictError extends ConflictException {
  constructor(message = "The hold cannot be confirmed in its current state") {
    super({
      code: "hold_state_conflict",
      message,
    });
  }
}
