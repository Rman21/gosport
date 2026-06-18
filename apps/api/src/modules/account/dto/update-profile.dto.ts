import { IsArray, IsEmail, IsIn, IsOptional, IsString, MaxLength } from "class-validator";

const supportedLocales = ["en", "he", "ru"] as const;

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  contactPhone?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(160)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1200)
  familyNote?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  favoriteSports?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(120)
  fullName?: string;

  @IsOptional()
  @IsIn(supportedLocales)
  preferredLocale?: (typeof supportedLocales)[number];
}
