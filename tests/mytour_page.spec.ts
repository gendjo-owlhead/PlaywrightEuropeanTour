import { test, expect } from '@playwright/test';
import { LoginPage } from './helpers/LoginPage';

// Test data
const validEmail = 'gendjo0104@yopmail.com';
const validPassword = 'Test123!';

const navTabs = [
  'Schedule',
  'Rankings',
  'Rolex Series',
  'News',
  'Watch',
  'Players',
  'Stats',
  'Q School',
];

test.describe('My Tour Page - Navigation Tabs', () => {
  test('Login and verify top navigation tabs', async ({ page }) => {
    // Use LoginPage POM to log in
    const loginPage = new LoginPage(page);
    await page.goto('https://www.europeantour.com');
    // Accept cookies if present
    try {
      const cookieDialog = page.locator('.ot-sdk-container[role="alertdialog"]');
      if (await cookieDialog.isVisible({ timeout: 5000 })) {
        const acceptButton = page.getByRole('button', { name: 'I Accept' });
        await acceptButton.click();
        await cookieDialog.waitFor({ state: 'hidden', timeout: 5000 });
      }
    } catch {}
    await loginPage.gotoLoginForm();
    await loginPage.login(validEmail, validPassword);
    // Wait for navigation after login
    await expect(page.locator('nav#navigation')).toBeVisible({ timeout: 30000 });

    // Go to My Tour page
    await page.goto('https://www.europeantour.com/my-tour/');
    await expect(page).toHaveURL(/\/my-tour\/?$/);

    // Verify each navigation tab is visible (scoped to nav#navigation)
    const navBar = page.locator('nav#navigation');
    for (const tab of navTabs) {
      await expect(navBar.getByRole('link', { name: tab, exact: true })).toBeVisible();
    }
  });
});
