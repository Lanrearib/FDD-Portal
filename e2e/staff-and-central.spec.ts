import { expect, test } from "@playwright/test";

test.describe("Counsellor workspace", () => {
  test("accepting a consent letter unlocks the next stage and is logged (FR-11)", async ({ page }) => {
    await page.goto("/staff/candidates/c2");
    await page.getByRole("button", { name: "Accept letter" }).click();
    await expect(page.getByRole("heading", { name: "Consent letter accepted" })).toBeVisible();
    await page.getByRole("tab", { name: /History/ }).click();
    await expect(page).toHaveURL(/tab=history/);
    await expect(page.getByText(/accepted consent letter, version 2/i).first()).toBeVisible();
  });

  test("returning a document requires a reason", async ({ page }) => {
    await page.goto("/staff/candidates/c2");
    await page.getByRole("button", { name: "Return for correction" }).click();
    await page.getByRole("button", { name: "Return letter" }).click();
    await expect(page.getByText(/Choose a reason/)).toBeVisible();
  });

  test("identity can only be verified once every check is ticked", async ({ page }) => {
    await page.goto("/staff/candidates/c1");
    const verify = page.getByRole("button", { name: "Verify identity" });
    await expect(verify).toBeDisabled();
    for (const label of [
      "The photo is clear and shows the whole document",
      "The name matches the profile",
      "The date of birth matches the profile",
      "The document hasn’t expired",
    ])
      await page.getByLabel(label).check();
    await verify.click();
    await expect(page.getByRole("heading", { name: "Identity verified" })).toBeVisible();
    await expect(page.getByText("Pastor Assessment Pending").first()).toBeVisible();
  });

  test("placing a case on hold needs a reason", async ({ page }) => {
    await page.goto("/staff/candidates/c4");
    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: /Place on hold/ }).click();
    await page.getByRole("button", { name: "Place on hold" }).click();
    await expect(page.getByText(/A reason is required/)).toBeVisible();
    await page.getByLabel("Reason").fill("Candidate asked to pause while travelling.");
    await page.getByRole("button", { name: "Place on hold" }).click();
    await expect(page.getByText("On Hold", { exact: true })).toBeVisible();
  });

  test("a closed case keeps its restricted reason hidden until asked", async ({ page }) => {
    await page.goto("/staff/cases/pc-0044");
    await expect(page.getByText(/Hidden. Viewing it is recorded/)).toBeVisible();
    await page.getByRole("button", { name: "Show" }).click();
    await expect(page.getByText(/did not feel at peace/)).toBeVisible();
  });
});

test.describe("Central office and leadership", () => {
  test("bulk upload imports only valid rows and covers Tema Zone (FR-18)", async ({ page }) => {
    await page.goto("/central/counsellors");
    await page.getByRole("button", { name: "Bulk upload" }).click();
    await page.getByRole("button", { name: /load a sample with some mistakes/ }).click();
    await page.getByRole("button", { name: "Check rows" }).click();
    await expect(page.getByText("2 ready to import")).toBeVisible();
    await expect(page.getByText("5 with problems")).toBeVisible();
    await expect(page.getByText("Already in the directory.")).toBeVisible();
    await page.getByRole("button", { name: "Import 2 valid rows" }).click();
    await expect(page.getByRole("row", { name: /Tema Zone/ })).toContainText("Bro. Kwesi Appiah");
  });

  test("leadership reports show totals but never candidate names", async ({ page }) => {
    await page.goto("/leadership");
    await expect(page.getByRole("heading", { name: "Family Development at a glance" })).toBeVisible();
    const text = await page.locator("main").innerText();
    for (const name of ["Emeka", "Olumide", "Segun", "Halima", "Kojo", "Zainab"]) expect(text).not.toContain(name);
  });

  test("every chart offers a table view", async ({ page }) => {
    await page.goto("/central/reports");
    const toggles = page.getByRole("button", { name: "Show as table" });
    await expect(toggles).toHaveCount(5);
    await toggles.first().click();
    await expect(page.getByRole("table").first()).toBeVisible();
  });
});
