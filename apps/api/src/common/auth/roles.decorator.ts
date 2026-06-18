import { SetMetadata } from "@nestjs/common";
import type { UserRole } from "@sportil/types";

export const ROLE_METADATA_KEY = "sportil:roles";

export function Roles(...roles: UserRole[]) {
  return SetMetadata(ROLE_METADATA_KEY, roles);
}
