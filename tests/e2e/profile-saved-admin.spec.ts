import { expect, test, type APIRequestContext, type Page, type TestInfo } from "@playwright/test";
import type { UserRole } from "@sportil/types";

const apiBaseUrl = process.env.SPORTIL_E2E_API_URL ?? "http://127.0.0.1:4100/api/v1";

type DevSession = {
  role: UserRole;
  userId: string;
};

function cleanId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function sessionHeaders(session: DevSession) {
  return {
    "x-sportil-dev-role": session.role,
    "x-sportil-dev-user": session.userId,
  };
}

function sessionsFor(testInfo: TestInfo) {
  const suffix = `${cleanId(testInfo.title)}-${testInfo.workerIndex}-${Date.now()}`;

  return {
    admin: {
      role: "city_admin",
      userId: `e2e-admin-${suffix}`,
    } satisfies DevSession,
    resident: {
      role: "resident",
      userId: `e2e-resident-${suffix}`,
    } satisfies DevSession,
  };
}

async function installDevSessions(page: Page, sessions: ReturnType<typeof sessionsFor>) {
  await page.addInitScript((value) => {
    window.localStorage.setItem("sportil.dev.residentSession", JSON.stringify(value.resident));
    window.localStorage.setItem("sportil.dev.adminSession", JSON.stringify(value.admin));
  }, sessions);
}

async function removeSavedGaliYam(request: APIRequestContext, resident: DevSession) {
  await request.delete(`${apiBaseUrl}/me/saved/facilities/gali-yam-tennis`, {
    headers: sessionHeaders(resident),
  });
}

test("resident can save profile and keep a facility in saved items", async ({ page, request }, testInfo) => {
  const sessions = sessionsFor(testInfo);
  const email = `r.${testInfo.workerIndex}.${Date.now()}@example.com`;
  await installDevSessions(page, sessions);
  await removeSavedGaliYam(request, sessions.resident);

  await page.goto("/ru/profile");
  await expect(page.getByRole("heading", { exact: true, name: "Профиль" })).toBeVisible();

  await page.getByRole("textbox", { exact: true, name: "Имя и фамилия" }).fill("E2E Resident");
  await page.getByRole("textbox", { exact: true, name: "Эл. почта" }).fill(email);
  await page.getByRole("textbox", { exact: true, name: "Телефон" }).fill("0500000099");
  await page.getByRole("textbox", { exact: true, name: "Семья и возраст детей" }).fill("E2E: ребенок 9 лет, теннис.");
  await page.getByRole("button", { exact: true, name: "Сохранить профиль" }).click();

  await expect(page.getByRole("heading", { exact: true, name: "Профиль сохранен" })).toBeVisible();

  const profileResponse = await request.get(`${apiBaseUrl}/me/profile`, {
    headers: sessionHeaders(sessions.resident),
  });
  expect(profileResponse.ok()).toBeTruthy();
  expect((await profileResponse.json()).data).toMatchObject({
    email,
    fullName: "E2E Resident",
  });

  await page.goto("/ru/facilities/gali-yam-tennis");

  const removeButton = page.getByRole("button", { exact: true, name: "Сохранено" });
  if (await removeButton.isVisible().catch(() => false)) {
    await removeButton.click();
    await expect(page.getByRole("button", { exact: true, name: "Сохранить" })).toBeVisible();
  }

  await page.getByRole("button", { exact: true, name: "Сохранить" }).click();
  await expect(page.getByRole("button", { exact: true, name: "Сохранено" })).toBeVisible();

  await page.goto("/ru/saved");
  await expect(page.getByRole("heading", { exact: true, name: "Сохранено" })).toBeVisible();
  await expect(page.getByText("Теннисный центр Гали-Ям", { exact: true })).toBeVisible();

  const savedResponse = await request.get(`${apiBaseUrl}/me/saved`, {
    headers: sessionHeaders(sessions.resident),
  });
  expect(savedResponse.ok()).toBeTruthy();
  const savedBody = await savedResponse.json();
  expect(savedBody.data.facilities.some((item: { facility: { id: string } }) => item.facility.id === "gali-yam-tennis")).toBe(true);
});

test("admin verification queue enforces RBAC and updates resident request status", async ({ page, request }, testInfo) => {
  const sessions = sessionsFor(testInfo);
  await installDevSessions(page, sessions);

  const createResponse = await request.post(`${apiBaseUrl}/verification-requests`, {
    data: {
      contactEmail: "resident.request@example.com",
      facilityId: "gali-yam-tennis",
      idempotencyKey: `e2e-verification-${sessions.resident.userId}`,
      kind: "report_wrong_info",
      message: "E2E request: please check the evening tennis schedule.",
      preferredLocale: "ru",
      residentName: "E2E Resident",
    },
    headers: sessionHeaders(sessions.resident),
  });
  expect(createResponse.ok()).toBeTruthy();
  const created = (await createResponse.json()).data as { id: string; publicId: string };

  const forbiddenAdminRead = await request.get(`${apiBaseUrl}/admin/verification-requests`, {
    headers: sessionHeaders(sessions.resident),
  });
  expect(forbiddenAdminRead.status()).toBe(403);

  await page.goto("/ru/admin/verification");
  const requestCard = page.locator(".admin-request-item").filter({ hasText: created.publicId });
  await expect(requestCard).toBeVisible();
  await expect(requestCard.getByText("E2E request: please check the evening tennis schedule.", { exact: true })).toBeVisible();

  await requestCard.getByRole("button", { exact: true, name: "В работе" }).click();
  await expect(requestCard.locator(".ui-status-badge").filter({ hasText: "В работе" })).toBeVisible();

  const adminRead = await request.get(`${apiBaseUrl}/admin/verification-requests`, {
    headers: sessionHeaders(sessions.admin),
  });
  expect(adminRead.ok()).toBeTruthy();
  const adminBody = await adminRead.json();
  const updated = adminBody.data.requests.find((item: { id: string }) => item.id === created.id);
  expect(updated).toMatchObject({ status: "in_progress" });
});
