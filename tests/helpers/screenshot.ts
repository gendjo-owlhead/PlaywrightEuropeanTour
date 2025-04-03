import { Page } from '@playwright/test';
import * as path from 'path';

/**
 * Takes a screenshot and saves it in the Screenshots directory
 * @param page Playwright page object
 * @param name Name of the screenshot (without .png extension)
 * @param options Additional screenshot options
 */
export async function takeScreenshot(page: Page, name: string, options: { fullPage?: boolean } = {}) {
    const screenshotPath = path.join('Screenshots', `${name}.png`);
    await page.screenshot({
        path: screenshotPath,
        ...options
    }).catch(e => {
        console.log(`Could not take screenshot ${name}:`, e);
    });
} 