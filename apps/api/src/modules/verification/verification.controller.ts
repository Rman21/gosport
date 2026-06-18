import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AuthContextGuard } from "../../common/auth/auth-context.guard.js";
import { CurrentUser } from "../../common/auth/current-user.decorator.js";
import { Roles } from "../../common/auth/roles.decorator.js";
import { RolesGuard } from "../../common/auth/roles.guard.js";
import type { AuthenticatedUser } from "../../common/auth/auth-context.js";
import { CreateVerificationRequestDto } from "./dto/create-verification-request.dto.js";
import {
  UpdateVerificationRequestStatusDto,
  verificationRequestStatuses,
} from "./dto/update-verification-request-status.dto.js";
import { VerificationService } from "./verification.service.js";

function parseStatus(value: string | undefined) {
  return verificationRequestStatuses.includes(value as (typeof verificationRequestStatuses)[number])
    ? (value as (typeof verificationRequestStatuses)[number])
    : undefined;
}

@Controller("api/v1")
@UseGuards(AuthContextGuard, RolesGuard)
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post("verification-requests")
  @Roles("resident", "guardian", "city_admin")
  createRequest(@Body() dto: CreateVerificationRequestDto, @CurrentUser() user: AuthenticatedUser) {
    return this.verificationService.createRequest(dto, user.id);
  }

  @Get("me/verification-requests")
  @Roles("resident", "guardian", "city_admin")
  listMine(@CurrentUser() user: AuthenticatedUser) {
    return this.verificationService.listForUser(user.id);
  }

  @Get("admin/verification-requests")
  @Roles("city_admin")
  listAdmin(@Query("status") status?: string) {
    return this.verificationService.listForAdmin(parseStatus(status));
  }

  @Patch("admin/verification-requests/:requestId")
  @Roles("city_admin")
  updateStatus(
    @Body() dto: UpdateVerificationRequestStatusDto,
    @CurrentUser() user: AuthenticatedUser,
    @Param("requestId") requestId: string,
  ) {
    return this.verificationService.updateStatus(requestId, dto, user.id);
  }
}
