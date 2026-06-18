import { UnauthorizedException, createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { AuthenticatedRequest, AuthenticatedUser } from "./auth-context.js";

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext): AuthenticatedUser => {
  const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

  if (!request.user) {
    throw new UnauthorizedException({
      code: "auth_required",
      message: "Authentication is required.",
    });
  }

  return request.user;
});
