import { IsString } from "class-validator";

export class ConfirmBookingDto {
  @IsString()
  idempotencyKey!: string;

  @IsString()
  providerIntentId!: string;
}
