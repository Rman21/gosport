import type { UserRole } from "@sportil/types";

export type AuthenticatedUser = {
  id: string;
  role: UserRole;
};

export type AuthenticatedRequest = {
  headers: Record<string, string | string[] | undefined>;
  user?: AuthenticatedUser;
};
