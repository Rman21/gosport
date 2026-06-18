import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";

export const verificationRequestStatuses = [
  "in_progress",
  "rejected",
  "resolved",
  "submitted",
  "triaged",
] as const;

export class UpdateVerificationRequestStatusDto {
  @IsOptional()
  @IsString()
  @MaxLength(800)
  adminNote?: string;

  @IsIn(verificationRequestStatuses)
  status!: (typeof verificationRequestStatuses)[number];
}
