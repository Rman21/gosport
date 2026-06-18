import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AuthContextGuard } from "../../common/auth/auth-context.guard.js";
import { CurrentUser } from "../../common/auth/current-user.decorator.js";
import { Roles } from "../../common/auth/roles.decorator.js";
import { RolesGuard } from "../../common/auth/roles.guard.js";
import type { AuthenticatedUser } from "../../common/auth/auth-context.js";
import { UpdateProfileDto } from "./dto/update-profile.dto.js";
import { AccountService } from "./account.service.js";

@Controller("api/v1")
@UseGuards(AuthContextGuard, RolesGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get("me/profile")
  @Roles("resident", "guardian", "city_admin")
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.accountService.getProfile(user.id);
  }

  @Patch("me/profile")
  @Roles("resident", "guardian", "city_admin")
  updateProfile(@Body() dto: UpdateProfileDto, @CurrentUser() user: AuthenticatedUser) {
    return this.accountService.updateProfile(user.id, dto);
  }

  @Get("me/saved")
  @Roles("resident", "guardian", "city_admin")
  listSaved(@CurrentUser() user: AuthenticatedUser) {
    return this.accountService.listSaved(user.id);
  }

  @Post("me/saved/facilities/:facilityId")
  @Roles("resident", "guardian", "city_admin")
  saveFacility(@CurrentUser() user: AuthenticatedUser, @Param("facilityId") facilityId: string) {
    return this.accountService.saveFacility(user.id, facilityId);
  }

  @Delete("me/saved/facilities/:facilityId")
  @Roles("resident", "guardian", "city_admin")
  removeSavedFacility(@CurrentUser() user: AuthenticatedUser, @Param("facilityId") facilityId: string) {
    return this.accountService.removeSavedFacility(user.id, facilityId);
  }
}
