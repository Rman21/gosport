export { createPrismaClient, defaultDatabaseUrl, prisma } from "./client.js";
export type { SportilPrismaClient } from "./client.js";

export const bookingOverlapConstraintName = "booking_occupancies_no_exclusive_overlap";
export const bookingSpaceOverlapConstraintName = "booking_occupancies_no_space_exclusive_overlap";
export const bookingOverlapConstraintNames = [
  bookingOverlapConstraintName,
  bookingSpaceOverlapConstraintName,
] as const;

export const bookingInvariantNotes = {
  capacityRowLock:
    "Group-class capacity is protected by SELECT ... FOR UPDATE on slot_capacities plus the slot_capacities_units_valid check.",
  exclusiveOverlap:
    "Court/space rental overlap is protected by PostgreSQL GiST exclusion constraints on resource_id and, when present, physical space_id.",
} as const;
