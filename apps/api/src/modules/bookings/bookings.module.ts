import { Module } from "@nestjs/common";
import { PaymentsModule } from "../payments/payments.module.js";
import { BookingsController } from "./bookings.controller.js";
import { BookingsService } from "./bookings.service.js";
import { BOOKING_REPOSITORY } from "./booking.repository.js";
import { PrismaBookingRepository } from "./prisma-booking.repository.js";

@Module({
  controllers: [BookingsController],
  imports: [PaymentsModule],
  providers: [
    BookingsService,
    {
      provide: BOOKING_REPOSITORY,
      useClass: PrismaBookingRepository,
    },
  ],
})
export class BookingsModule {}
