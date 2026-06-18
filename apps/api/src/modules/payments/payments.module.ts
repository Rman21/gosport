import { Module } from "@nestjs/common";
import { createMockPaymentProvider } from "@sportil/payments";
import { PAYMENT_PROVIDER } from "./payments.constants.js";

@Module({
  exports: [PAYMENT_PROVIDER],
  providers: [
    {
      provide: PAYMENT_PROVIDER,
      useFactory: createMockPaymentProvider,
    },
  ],
})
export class PaymentsModule {}
