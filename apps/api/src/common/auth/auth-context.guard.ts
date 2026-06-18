import { Injectable, UnauthorizedException, type CanActivate, type ExecutionContext } from "@nestjs/common";
import type { UserRole } from "@sportil/types";
import type { AuthenticatedRequest, AuthenticatedUser } from "./auth-context.js";

const userRoles = [
  "resident",
  "guardian",
  "coach",
  "school_operator",
  "facility_operator",
  "city_admin",
  "system",
] as const satisfies readonly UserRole[];

const defaultUsers = {
  city_admin: "demo-admin",
  coach: "demo-coach",
  facility_operator: "demo-facility-operator",
  guardian: "demo-guardian",
  resident: "demo-resident",
  school_operator: "demo-school-operator",
  system: "sportil-system",
} satisfies Record<UserRole, string>;

function developmentAuthEnabled() {
  return process.env.NODE_ENV !== "production" && process.env.SPORTIL_DEV_AUTH !== "false";
}

function headerValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isUserRole(value: string | undefined): value is UserRole {
  return Boolean(value && (userRoles as readonly string[]).includes(value));
}

function authError(message: string) {
  return new UnauthorizedException({
    code: "auth_required",
    message,
  });
}

@Injectable()
export class AuthContextGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = this.resolveUser(request);

    request.user = user;

    return true;
  }

  private resolveUser(request: AuthenticatedRequest): AuthenticatedUser {
    const devRole = headerValue(request.headers["x-sportil-dev-role"]);
    const devUserId = headerValue(request.headers["x-sportil-dev-user"]);
    const legacyAdminUserId = headerValue(request.headers["x-sportil-admin-user"]);
    const legacyResidentUserId = headerValue(request.headers["x-sportil-demo-user"]);
    const allowDevelopmentAuth = developmentAuthEnabled();

    if (devRole || devUserId) {
      if (!allowDevelopmentAuth) {
        throw authError("Development auth headers are disabled in this environment.");
      }

      if (!isUserRole(devRole)) {
        throw authError("A valid SportIL development role is required.");
      }

      return {
        id: devUserId || defaultUsers[devRole],
        role: devRole,
      };
    }

    if (legacyAdminUserId) {
      if (!allowDevelopmentAuth) {
        throw authError("Legacy development auth headers are disabled in this environment.");
      }

      return {
        id: legacyAdminUserId,
        role: "city_admin",
      };
    }

    if (legacyResidentUserId) {
      if (!allowDevelopmentAuth) {
        throw authError("Legacy development auth headers are disabled in this environment.");
      }

      return {
        id: legacyResidentUserId,
        role: "resident",
      };
    }

    if (allowDevelopmentAuth) {
      return {
        id: defaultUsers.resident,
        role: "resident",
      };
    }

    throw authError("A server-side session is required.");
  }
}
