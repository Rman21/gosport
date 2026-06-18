import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

export const defaultDatabaseUrl = "postgresql://sportil:sportil@localhost:5432/sportil";

export function createPrismaClient(databaseUrl = process.env.DATABASE_URL ?? defaultDatabaseUrl) {
  const adapter = new PrismaPg({ connectionString: databaseUrl });

  return new PrismaClient({ adapter });
}

export const prisma = createPrismaClient();

export type SportilPrismaClient = ReturnType<typeof createPrismaClient>;
