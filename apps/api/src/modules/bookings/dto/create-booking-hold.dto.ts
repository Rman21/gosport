import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateBookingHoldDto {
  @IsString()
  idempotencyKey!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(16)
  participantsCount?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(8)
  requestedUnits?: number;

  @IsString()
  slotId!: string;
}
