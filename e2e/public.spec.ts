import { expect, test } from "@playwright/test";

test.describe("Public site and getting started", () => {
  test("landing page leads to the first-time-or-returning choice", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Walking with families through every season");
    await page.getByRole("link", { name: "Start the marriage process" }).first().click();
    await expect(page.getByRole("heading", { name: "Have you used this portal before?" })).toBeVisible();
    await page.getByRole("link", { name: /First time here/ }).click();
    await expect(page).toHaveURL(/\/register$/);
  });

  test("registration validates each step and only offers directory Pastors (FR-13, FR-14)", async ({ page }) => {
    await page.goto("/register");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Step 1: errors when nothing is chosen
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Choose whether you are registering as a brother or a sister.")).toBeVisible();
    await page.getByText("Brother", { exact: true }).click();
    await page.getByLabel("I have prayed through this decision.").check();
    await page.getByLabel("I have a valid photo ID to hand.").check();
    await page.getByLabel("I have spoken to my Pastor about this.").check();
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 2: details, including an under-18 date of birth
    await page.getByLabel("First name").fill("Test");
    await page.getByLabel("Last name").fill("Candidate");
    await page.getByLabel("Date of birth").fill("2012-01-01");
    await page.getByLabel("Email address").fill("test.candidate@example.com");
    await page.getByLabel("Phone number").fill("+234 803 555 0100");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("You must be 18 or older to register.")).toBeVisible();
    await page.getByLabel("Date of birth").fill("1996-04-12");
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 3: Area, Zone, church
    await page.getByLabel("Area").selectOption("lagos");
    await page.getByLabel("Zone").selectOption("ikeja");
    await page.getByLabel("Church").selectOption("ogba");
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 4: directory only; inactive Pastors never appear
    await page.getByLabel("Search the Pastor directory").fill("Daniel Oke"); // inactive Pastor
    await expect(page.getByText("No Pastor matches")).toBeVisible();
    await page.getByLabel("Search the Pastor directory").fill("Grace");
    await page.getByRole("button", { name: /Pastor Grace Bello/ }).click();
    await page.getByLabel("My Pastor is unavailable to introduce me").check();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Tell us why your Pastor is unavailable.")).toBeVisible();
    await page.getByLabel("Why is your Pastor unavailable?").selectOption("On leave");
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 5: account
    await page.getByLabel("Create a password").fill("testpass2026");
    await page.getByLabel("Confirm your password").fill("testpass2026");
    await page.getByLabel(/I have read the/).check();
    await page.getByLabel(/registering doesn’t approve me/).check();
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 6: the introduction goes to the Zonal Pastor, standing in
    await expect(page.getByText("Pastor Michael Ade", { exact: true }).first()).toBeVisible();
    await expect(page.getByText(/Standing in for Pastor Grace Bello/)).toBeVisible();
    await page.getByRole("button", { name: "Create my profile" }).click();

    // Email code: wrong, then right
    await expect(page).toHaveURL(/verify-email/);
    await page.getByLabel("Digit 1 of 6").fill("111111");
    await page.getByRole("button", { name: "Verify email" }).click();
    await expect(page.getByText(/You have 4 tries left/)).toBeVisible();
    await page.getByLabel("Digit 1 of 6").fill("246810");
    await page.getByRole("button", { name: "Verify email" }).click();
    await expect(page.getByRole("heading", { name: /Your profile is ready/ })).toBeVisible();
  });

  test("couple counselling form lists every missing field", async ({ page }) => {
    await page.goto("/counselling");
    await page.getByRole("button", { name: "Send request" }).click();
    await expect(page.getByText("Enter your name.")).toBeVisible();
    await expect(page.getByText("Choose at least one time that suits you.")).toBeVisible();
    await expect(page.getByLabel("Your name")).toBeFocused();
  });

  test("bereavement request can be sent", async ({ page }) => {
    await page.goto("/bereavement");
    await page.getByLabel("Your name").fill("Test Member");
    await page.getByLabel("Phone number").fill("+234 803 555 0101");
    await page.getByLabel("Area").selectOption("lagos");
    await page.getByLabel(/request is confidential/).check();
    await page.getByRole("button", { name: "Send request" }).click();
    await expect(page.getByRole("heading", { name: "We’ve received your request" })).toBeVisible();
  });

  test("unknown pages show a helpful 404", async ({ page }) => {
    const res = await page.goto("/no-such-page");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "We can’t find that page" })).toBeVisible();
  });
});
