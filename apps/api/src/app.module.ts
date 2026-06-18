import { Module } from "@nestjs/common";
import { AccountModule } from "./modules/account/account.module.js";
import { BookingsModule } from "./modules/bookings/bookings.module.js";
import { HealthModule } from "./modules/health/health.module.js";
import { VerificationModule } from "./modules/verification/verification.module.js";

@Module({
  imports: [AccountModule, BookingsModule, HealthModule, VerificationModule],
})
export class AppModule {}
