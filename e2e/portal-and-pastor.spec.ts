import { expect, test } from "@playwright/test";

const journey = (page: import("@playwright/test").Page) => page.locator("#journey");

test.describe("Candidate portal", () => {
  test("each persona sees their own next step", async ({ page }) => {
    await page.goto("/portal/as/new");
    await expect(page.getByRole("heading", { name: "Good afternoon, Femi" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Verify your identity" })).toBeVisible();

    await page.goto("/portal/as/tunde");
    await expect(page.getByRole("heading", { name: "Upload a new parental consent letter" })).toBeVisible();
  });

  test("uploading a corrected consent letter updates the journey (FR-07, FR-15)", async ({ page }) => {
    await page.goto("/portal/as/tunde?next=/portal/documents");
    await page.locator('input[type="file"]').setInputFiles({ name: "notes.docx", mimeType: "application/msword", buffer: Buffer.from("x") });
    await expect(page.getByText(/isn’t a PDF, JPG or PNG/)).toBeVisible();
    await page.locator('input[type="file"]').setInputFiles({ name: "letter.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4") });
    await page.getByRole("button", { name: "Submit letter" }).click();
    await expect(page.getByText(/will review your letter/)).toBeVisible();
    await expect(journey(page).getByText("Pending Counsellor Review")).toBeVisible();
  });

  test("a sister’s decline closes the proposal (FR-23)", async ({ page }) => {
    await page.goto("/portal/as/zainab?next=/portal/proposal");
    await page.getByText("Decline the proposal", { exact: true }).first().click();
    await page.getByRole("button", { name: "Decline the proposal" }).click();
    await expect(page.getByText("Tick the box to confirm your response.")).toBeVisible();
    await page.getByLabel(/I decline Ibrahim’s proposal/).check();
    await page.getByRole("button", { name: "Decline the proposal" }).click();
    await expect(page.getByRole("heading", { name: "This proposal is closed" })).toBeVisible();
    await expect(page.getByText("Rejected by Sister")).toBeVisible();
  });

  test("a returning candidate cannot start a second active proposal", async ({ page }) => {
    await page.goto("/portal/as/zainab?next=/portal/new-proposal");
    await expect(page.getByRole("heading", { name: "You already have an active proposal" })).toBeVisible();
  });
});

test.describe("Pastor assessment link (PRD §7)", () => {
  test("a Pastor confirms by email code and submits an introduction", async ({ page }) => {
    await page.goto("/assess/demo");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByLabel("Digit 1 of 6").fill("246810");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Review answers" }).click();
    await expect(page.getByText("Please confirm the declaration.")).toBeVisible();

    await page.getByText("Yes", { exact: true }).first().click();
    await page.getByLabel("What does Femi do in the church?").fill("Serves in the technical unit.");
    await page.getByText("Unable to confirm", { exact: true }).click();
    await page.getByLabel(/these answers are accurate/).check();
    await page.getByRole("button", { name: "Review answers" }).click();
    await expect(page.getByText(/counsellor will follow up/)).toBeVisible();
    await page.getByRole("button", { name: "Submit introduction" }).click();
    await expect(page.getByRole("heading", { name: "Thank you, Pastor Grace Bello" })).toBeVisible();
  });

  test("expired, replaced and unknown links explain what to do", async ({ page }) => {
    await page.goto("/assess/expired");
    await expect(page.getByRole("heading", { name: "This link has expired" })).toBeVisible();
    await page.goto("/assess/replaced");
    await expect(page.getByRole("heading", { name: "A newer link has been sent" })).toBeVisible();
    await page.goto("/assess/made-up-token");
    await expect(page.getByRole("heading", { name: "This link isn’t valid" })).toBeVisible();
  });
});
