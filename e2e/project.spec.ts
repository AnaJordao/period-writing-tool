import { test, expect } from "@playwright/test";

test("user can create a project", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "New Project" }).click();

  await page.getByLabel("Project name").fill("My First Project");

  await page.getByLabel("Description").fill("A test project");

  await page.getByRole("button", { name: "Create" }).click();

  await expect(page.getByText("My First Project")).toBeVisible();
});
