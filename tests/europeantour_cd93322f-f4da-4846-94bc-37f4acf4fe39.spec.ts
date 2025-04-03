import { test } from '@playwright/test';
import { expect } from '@playwright/test';

test('EuropeanTour_2025-03-31', async ({ page, context }) => {
  
    // Navigate to URL
    await page.goto('https://www.europeantour.com');

    // Take screenshot
    await page.screenshot({ path: 'homepage.png', fullPage: true });
});