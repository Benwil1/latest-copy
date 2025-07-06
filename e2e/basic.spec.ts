import { test, expect } from '@playwright/test';

test('homepage loads and displays expected content', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/(Home|Welcome|Next\.js)/i);
  // Optionally check for a visible element or text
  // await expect(page.getByText(/sign up|login|profile/i)).toBeVisible();
}); 