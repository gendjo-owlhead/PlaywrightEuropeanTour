import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly loginLink: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly forgotPasswordButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginLink = page.getByRole('link', { name: 'Login' });
        this.emailInput = page.locator('#gigya-login-form [type="email"], #gigya-login-form [type="text"]').first();
        this.passwordInput = page.locator('#gigya-login-form [type="password"]').first();
        this.loginButton = page.locator('#gigya-login-form input[type="submit"], #gigya-login-form button[type="submit"]').first();
        this.errorMessage = page.locator('#gigya-login-form .gigya-composite-control-form-error');
        this.forgotPasswordButton = page.getByRole('button', { name: 'Forgot your password?' });
    }

    async gotoLoginForm() {
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page.locator('nav#navigation')).toBeVisible({ timeout: 30000 });
        await this.loginLink.waitFor({ state: 'visible', timeout: 10000 });
        await this.loginLink.click();
        await this.page.waitForSelector('#gigya-login-form', { timeout: 30000 });
        await this.page.waitForTimeout(3000); // Ensure form is fully loaded
    }

    async login(email: string, password: string) {
        await this.emailInput.waitFor({ state: 'visible', timeout: 15000 });
        await this.emailInput.fill(email);
        await this.passwordInput.waitFor({ state: 'visible', timeout: 15000 });
        await this.passwordInput.fill(password);
        await this.loginButton.waitFor({ state: 'visible', timeout: 15000 });
        await this.loginButton.click();
    }

    async assertLoginError(expectedText: string) {
        await expect(this.errorMessage).toBeVisible({ timeout: 15000 });
        await expect(this.errorMessage).toHaveText(expectedText, { timeout: 5000 });
    }

    async clickForgotPassword() {
        await this.forgotPasswordButton.waitFor({ state: 'visible', timeout: 15000 });
        await this.forgotPasswordButton.click();
    }
}
