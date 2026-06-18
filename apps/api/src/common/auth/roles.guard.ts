import { ForbiddenException, Injectable, UnauthorizedException, type CanActivate, type ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { UserRole } from "@sportil/types";
import type { AuthenticatedRequest } from "./auth-context.js";
import { ROLE_METADATA_KEY } from "./roles.decorator.js";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLE_METADATA_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.user) {
      throw new UnauthorizedException({
        code: "auth_required",
        message: "Authentication is required.",
      });
    }

    if (roles.includes(request.user.role)) {
      return true;
    }

    throw new ForbiddenException({
      code: "role_forbidden",
      message: "This action is not available for the current role.",
      requiredRoles: roles,
    });
  }
}
