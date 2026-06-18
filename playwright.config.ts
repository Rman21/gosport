import { defineConfig, devices } from "@playwright/test";

const apiPort = Number(process.env.SPORTIL_E2E_API_PORT ?? 4100);
const webPort = Number(process.env.SPORTIL_E2E_WEB_PORT ?? 3101);
const databaseUrl = process.env.DATABASE_URL ?? "postgresql://sportil:sportil@localhost:5432/sportil";
const apiBaseUrl = process.env.SPORTIL_E2E_API_URL ?? `http://127.0.0.1:${apiPort}/api/v1`;
const webBaseUrl = process.env.SPORTIL_E2E_WEB_URL ?? `http://127.0.0.1:${webPort}`;

export default defineConfig({
  expect: {
    timeout: 8_000,
  },
  fullyParallel: false,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],
  testDir: "./tests/e2e",
  timeout: 45_000,
  use: {
    actionTimeout: 10_000,
    baseURL: webBaseUrl,
    navigationTimeout: 20_000,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command: `DATABASE_URL=${databaseUrl} PORT=${apiPort} corepack pnpm --filter @sportil/api build && DATABASE_URL=${databaseUrl} PORT=${apiPort} corepack pnpm --filter @sportil/api start`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      url: `${apiBaseUrl}/me/profile`,
    },
    {
      command: `NEXT_PUBLIC_SPORTIL_API_BASE_URL=${apiBaseUrl} corepack pnpm --filter @sportil/web build && NEXT_PUBLIC_SPORTIL_API_BASE_URL=${apiBaseUrl} corepack pnpm --filter @sportil/web start -p ${webPort}`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      url: webBaseUrl,
    },
  ],
  workers: 1,
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { height: 900, width: 1280 },
      },
    },
  ],
});
