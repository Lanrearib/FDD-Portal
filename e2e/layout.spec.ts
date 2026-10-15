import { expect, test } from "@playwright/test";

/* Every screen at phone width: no sideways scrolling, one page heading, and a main landmark. */

const routes = [
  "/",
  "/start",
  "/register",
  "/login",
  "/recover",
  "/privacy",
  "/counselling",
  "/bereavement",
  "/assess/demo",
  "/portal",
  "/portal/identity",
  "/portal/documents",
  "/portal/appointment",
  "/portal/proposal",
  "/portal/counselling",
  "/portal/messages",
  "/portal/profile",
  "/portal/history",
  "/staff",
  "/staff/candidates",
  "/staff/candidates/c1",
  "/staff/candidates/c7",
  "/staff/cases",
  "/staff/cases/pc-0102",
  "/staff/appointments",
  "/staff/messages",
  "/staff/support",
  "/staff/reports",
  "/central",
  "/central/counsellors",
  "/central/pastors",
  "/central/reports",
  "/central/audit",
  "/central/settings",
  "/leadership",
];

test.describe("Phone layout", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  for (const route of routes) {
    test(`${route} fits a 375px screen`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, "page scrolls sideways").toBeLessThanOrEqual(0);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main")).toHaveCount(1);
      expect(errors, "uncaught errors").toEqual([]);
    });
  }
});
