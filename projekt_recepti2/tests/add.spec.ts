import { test, expect } from '@playwright/test';

test('add recipe page loads after login', async ({ page }) => {
  // User is already logged in via storageState

  await page.goto('/add');

  // Check if the page has the form elements
  await expect(page.locator('input[name="title"]')).toBeVisible();
  await expect(page.locator('textarea[name="ingredients"]')).toBeVisible();
  await expect(page.locator('textarea[name="steps"]')).toBeVisible();
  await expect(page.locator('input[type="file"]')).toBeAttached(); // Changed to toBeAttached since it's hidden
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});