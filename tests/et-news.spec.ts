import { test, expect } from '@playwright/test';
import { takeScreenshot } from './helpers/screenshot';

test.describe('European Tour News Page', () => {
  test('should load the news page correctly', async ({ page }) => {
    // Navigate to the news page
    await page.goto('https://www.europeantour.com/dpworld-tour/news/');

    // Wait for the page to load and check for a known element or title
    // Example: Check if the main heading is visible
    await expect(page.locator('h1')).toBeVisible();

    // Alternatively, check the page title
    await expect(page).toHaveTitle(/News | DP World Tour/); // Adjust regex if needed
  });
});
