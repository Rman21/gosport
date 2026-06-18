import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { AuthContextGuard } from "../../common/auth/auth-context.guard.js";
import { CurrentUser } from "../../common/auth/current-user.decorator.js";
import { Roles } from "../../common/auth/roles.decorator.js";
import { RolesGuard } from "../../common/auth/roles.guard.js";
import type { AuthenticatedUser } from "../../common/auth/auth-context.js";
import { ConfirmBookingDto } from "./dto/confirm-booking.dto.js";
import { CreateBookingHoldDto } from "./dto/create-booking-hold.dto.js";
import { BookingsService } from "./bookings.service.js";

function optionalNumber(value: string | undefined) {
  if (value === undefined) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

@Controller("api/v1")
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get("me/bookings")
  @UseGuards(AuthContextGuard, RolesGuard)
  @Roles("resident", "guardian", "city_admin")
  listMine(@CurrentUser() user: AuthenticatedUser) {
    return this.bookingsService.listUserBookings(user.id);
  }

  @Post("booking-holds")
  @UseGuards(AuthContextGuard, RolesGuard)
  @Roles("resident", "guardian", "city_admin")
  createHold(
    @Body() dto: CreateBookingHoldDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const optionalFields = {
      ...(dto.participantsCount === undefined ? {} : { participantsCount: dto.participantsCount }),
      ...(dto.requestedUnits === undefined ? {} : { requestedUnits: dto.requestedUnits }),
    };

    return this.bookingsService.createHold({
      idempotencyKey: dto.idempotencyKey,
      ...optionalFields,
      slotId: dto.slotId,
      userId: user.id,
    });
  }

  @Post("booking-holds/:holdId/confirm")
  @UseGuards(AuthContextGuard, RolesGuard)
  @Roles("resident", "guardian", "city_admin")
  confirmHold(@Body() dto: ConfirmBookingDto, @Param("holdId") holdId: string) {
    return this.bookingsService.confirmHold({
      holdId,
      idempotencyKey: dto.idempotencyKey,
      providerIntentId: dto.providerIntentId,
    });
  }

  @Get("booking-slots/:slotId/alternatives")
  getSlotAlternatives(
    @Param("slotId") slotId: string,
    @Query("requestedUnits") requestedUnits?: string,
    @Query("userAge") userAge?: string,
  ) {
    const parsedRequestedUnits = optionalNumber(requestedUnits);
    const parsedUserAge = optionalNumber(userAge);
    const optionalFields = {
      ...(parsedRequestedUnits === undefined ? {} : { requestedUnits: parsedRequestedUnits }),
      ...(parsedUserAge === undefined ? {} : { userAge: parsedUserAge }),
    };

    return this.bookingsService.getSlotAlternatives({
      ...optionalFields,
      slotId,
    });
  }
}
