import { test, expect } from '@playwright/test';
import { takeScreenshot } from './helpers/screenshot';

test.describe('DP World Tour Website Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the homepage before each test
        await page.goto('https://www.europeantour.com');
        
        // Handle cookie consent by clicking "I Accept" button
        try {
            const acceptButton = page.getByRole('button', { name: 'I Accept' });
            await expect(acceptButton).toBeVisible({ timeout: 10000 });
            await acceptButton.click();
            
            // Wait for cookie banner to disappear
            await expect(page.locator('[role="alertdialog"]')).not.toBeVisible();
        } catch (e) {
            console.log('Cookie consent might not be present:', e);
        }
    });

    test('Homepage - Verify main elements', async ({ page }) => {
        // Wait for the initial page load
        await page.waitForLoadState('domcontentloaded');
        
        // Wait for the navigation to be visible instead of waiting for network idle
        await expect(page.locator('nav#navigation')).toBeVisible({ timeout: 30000 });

        // Verify the page title
        await expect(page).toHaveTitle(/DP World Tour/);

        // Take screenshots of key pages
        await takeScreenshot(page, 'homepage');

        // Look for the main header using a more reliable selector
        await expect(page.locator('#navigation')).toBeVisible({ timeout: 10000 });
    });

    test('Search functionality', async ({ page }) => {
        // Wait for the initial page load and navigation to be ready
        await page.waitForLoadState('domcontentloaded');
        await expect(page.locator('nav#navigation')).toBeVisible({ timeout: 30000 });

        // Find and click the search icon in the top navigation
        const searchButton = page.locator('.icon--search').first();
        await searchButton.waitFor({ state: 'visible', timeout: 10000 });
        await searchButton.click();

        // Look for the search textbox directly
        const searchInput = page.getByRole('textbox').first();
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        
        // Type search term and wait briefly for any debounce
        await searchInput.fill('Rory McIlroy');
        await page.waitForTimeout(1000);
        
        // Press Enter and wait for any network requests to complete
        await searchInput.press('Enter');
        await page.waitForLoadState('networkidle', { timeout: 20000 });

        // Take screenshots of key pages
        await takeScreenshot(page, 'search-results');
    });

    test('Tournament Schedule', async ({ page }) => {
        // Navigate to tournament schedule using a more specific selector
        await page.locator('.navigation-items__link:has-text("Schedule")').first().click();

        // Verify schedule page elements
        await expect(page).toHaveURL(/.*schedule.*/i);
        
        // Take screenshots of key pages
        await takeScreenshot(page, 'schedule');
    });

    test('Player Profiles', async ({ page }) => {
        // Navigate to players section using a more specific selector
        await page.locator('.navigation-items__link:has-text("Players")').first().click();

        // Verify players page elements
        await expect(page).toHaveURL(/.*players.*/i);
        
        // Take screenshots of key pages
        await takeScreenshot(page, 'players');
    });

    test('Rankings', async ({ page }) => {
        // Navigate to rankings page using a more specific selector
        await page.locator('.navigation-items__link[href*="/rankings/overview/"]').first().click();

        // Verify rankings page elements
        await expect(page).toHaveURL(/.*rankings.*/i);
        
        // Take screenshots of key pages
        await takeScreenshot(page, 'rankings');
    });
}); 