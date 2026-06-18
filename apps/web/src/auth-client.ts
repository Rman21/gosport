"use client";

import { userRoles, type UserRole } from "@sportil/types";

type DevSessionKind = "admin" | "resident";

type DevSession = {
  role: UserRole;
  userId: string;
};

const sessionKeys = {
  admin: "sportil.dev.adminSession",
  resident: "sportil.dev.residentSession",
} satisfies Record<DevSessionKind, string>;

const defaultSessions = {
  admin: {
    role: "city_admin",
    userId: "demo-admin",
  },
  resident: {
    role: "resident",
    userId: "demo-resident",
  },
} satisfies Record<DevSessionKind, DevSession>;

function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && (userRoles as readonly string[]).includes(value);
}

function readStoredSession(kind: DevSessionKind): DevSession {
  if (typeof window === "undefined") {
    return defaultSessions[kind];
  }

  try {
    const stored = window.localStorage.getItem(sessionKeys[kind]);
    const parsed = stored ? JSON.parse(stored) as Partial<DevSession> : null;

    if (isUserRole(parsed?.role) && typeof parsed.userId === "string" && parsed.userId.trim()) {
      return {
        role: parsed.role,
        userId: parsed.userId.trim(),
      };
    }
  } catch {
    window.localStorage.removeItem(sessionKeys[kind]);
  }

  return defaultSessions[kind];
}

export function authHeaders(kind: DevSessionKind): Record<string, string> {
  const session = readStoredSession(kind);

  return {
    "x-sportil-dev-role": session.role,
    "x-sportil-dev-user": session.userId,
  };
}
