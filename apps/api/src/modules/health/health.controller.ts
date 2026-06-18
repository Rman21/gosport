import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { prisma } from "@sportil/db";

@Controller()
export class HealthController {
  @Get("healthz")
  health() {
    return {
      ok: true,
      service: "sportil-api",
      timestamp: new Date().toISOString(),
    };
  }

  @Get("readyz")
  async readiness() {
    try {
      await prisma.$queryRaw`SELECT 1`;

      return {
        database: "ok",
        ok: true,
        service: "sportil-api",
        timestamp: new Date().toISOString(),
      };
    } catch {
      throw new ServiceUnavailableException({
        code: "database_unavailable",
        message: "Database readiness check failed.",
      });
    }
  }
}
