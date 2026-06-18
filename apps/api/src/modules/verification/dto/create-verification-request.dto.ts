import { IsEmail, IsIn, IsOptional, IsString, MaxLength } from "class-validator";

export const verificationRequestKinds = [
  "availability_request",
  "claim_facility",
  "report_wrong_info",
  "request_online_booking",
] as const;

export const supportedLocales = ["en", "he", "ru"] as const;

export class CreateVerificationRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  contactPhone?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(160)
  contactEmail?: string;

  @IsOptional()
  @IsString()
  facilityId?: string;

  @IsString()
  @MaxLength(180)
  idempotencyKey!: string;

  @IsIn(verificationRequestKinds)
  kind!: (typeof verificationRequestKinds)[number];

  @IsOptional()
  @IsString()
  @MaxLength(1200)
  message?: string;

  @IsIn(supportedLocales)
  preferredLocale!: (typeof supportedLocales)[number];

  @IsOptional()
  @IsString()
  @MaxLength(120)
  residentName?: string;
}
