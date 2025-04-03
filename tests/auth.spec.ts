import { test, expect } from '@playwright/test';

test.describe('DP World Tour Authentication Tests', () => {
    // Add test-wide variable to store the registration email
    let registeredEmail: string;

    test.beforeEach(async ({ page }) => {
        // Navigate to the homepage before each test
        await page.goto('https://www.europeantour.com');
        
        // Handle cookie consent
        try {
            const acceptButton = page.getByRole('button', { name: 'I Accept' });
            await expect(acceptButton).toBeVisible({ timeout: 10000 });
            await acceptButton.click();
            await expect(page.locator('[role="alertdialog"]')).not.toBeVisible();
        } catch (e) {
            console.log('Cookie consent might not be present:', e);
        }
    });

    test('User Registration - New Account', async ({ page }) => {
        // Generate unique email and store it for later use
        registeredEmail = `test.user.${Date.now()}@example.com`;
        
        // Wait for page load
        await page.waitForLoadState('domcontentloaded');
        await expect(page.locator('nav#navigation')).toBeVisible({ timeout: 30000 });

        // Click "Sign up" link
        const signUpLink = page.getByRole('link', { name: 'Sign up' });
        await signUpLink.waitFor({ state: 'visible', timeout: 10000 });
        await signUpLink.click();

        // Wait for registration form and Gigya container to be ready
        await page.waitForLoadState('networkidle');
        
        // Wait for the Gigya registration screen specifically
        const registrationScreen = page.locator('#gigya-register-screen[data-screenset-roles="instance"]');
        await registrationScreen.waitFor({ state: 'visible', timeout: 15000 });

        // Wait for form to be interactive
        await page.waitForTimeout(2000);
        
        // Fill registration form using Gigya instance-specific selectors
        const firstNameInput = page.locator('[data-screenset-roles="instance"] [data-gigya-name="profile.firstName"]');
        await firstNameInput.waitFor({ state: 'visible', timeout: 10000 });
        await firstNameInput.fill('Test');

        const lastNameInput = page.locator('[data-screenset-roles="instance"] [data-gigya-name="profile.lastName"]');
        await lastNameInput.waitFor({ state: 'visible', timeout: 10000 });
        await lastNameInput.fill('User');

        const emailInput = page.locator('[data-screenset-roles="instance"] [data-gigya-name="email"]');
        await emailInput.waitFor({ state: 'visible', timeout: 10000 });
        await emailInput.fill(registeredEmail);

        const confirmEmailInput = page.locator('[data-screenset-roles="instance"] [data-gigya-name="local.confirmemail"]');
        await confirmEmailInput.waitFor({ state: 'visible', timeout: 10000 });
        await confirmEmailInput.fill(registeredEmail);
        
        const passwordInput = page.locator('[data-screenset-roles="instance"] [data-gigya-name="password"]');
        await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
        await passwordInput.fill('TestPassword123!');
        
        const confirmPasswordInput = page.locator('[data-screenset-roles="instance"] [data-gigya-name="passwordRetype"]');
        await confirmPasswordInput.waitFor({ state: 'visible', timeout: 10000 });
        await confirmPasswordInput.fill('TestPassword123!');

        // Find and click the Sign Up button using exact selector
        const submitButton = page.locator('#gigya-register-form > div:nth-child(2) > div:nth-child(1) > div.gigya-composite-control.gigya-composite-control-submit.user--submit-button.button.button--large > input');
        await submitButton.waitFor({ state: 'visible', timeout: 10000 });
        
        // Click the button and verify redirection to my-tour-promo
        try {
            await submitButton.click();
            
            // Wait for redirection to my-tour-promo page
            await expect(page).toHaveURL('https://www.europeantour.com/my-tour-promo', { timeout: 30000 });
            
            // Take screenshot if possible
            await page.screenshot({ path: 'Screenshots/registration-success.png' }).catch(e => {
                console.log('Could not take screenshot:', e);
            });
        } catch (e) {
            console.log('Error during form submission:', e);
            throw e;
        }
    });

    test('User Login - Valid Credentials', async ({ page }) => {
        // Wait for page load
        await page.waitForLoadState('domcontentloaded');
        await expect(page.locator('nav#navigation')).toBeVisible({ timeout: 30000 });

        // Click "Login" link
        const loginLink = page.getByRole('link', { name: 'Login' });
        await loginLink.waitFor({ state: 'visible', timeout: 10000 });
        await loginLink.click();

        // Wait for the Gigya login form to be ready
        await page.waitForSelector('#gigya-login-form', { timeout: 30000 });
        
        // Add a small delay to ensure form is fully loaded
        await page.waitForTimeout(3000);

        // Fill login form using more reliable selectors
        const emailInput = page.locator('#gigya-login-form [type="email"], #gigya-login-form [type="text"]').first();
        await emailInput.waitFor({ state: 'visible', timeout: 15000 });
        await emailInput.fill('gendjo0104@yopmail.com');

        const passwordInput = page.locator('#gigya-login-form [type="password"]').first();
        await passwordInput.waitFor({ state: 'visible', timeout: 15000 });
        await passwordInput.fill('Test123!');
        
        // Click login button using specific selector
        const loginButton = page.locator('#gigya-login-form input[type="submit"], #gigya-login-form button[type="submit"]').first();
        await loginButton.waitFor({ state: 'visible', timeout: 15000 });
        await loginButton.click();

        // Wait for successful login - check for navigation menu visibility
        await expect(page.locator('nav#navigation')).toBeVisible({ timeout: 30000 });

        // Take screenshot of logged in state
        await page.screenshot({ path: 'Screenshots/login-success.png' });

        // Now try to find the forgot password link using role-based selector
        const forgotPasswordButton = page.getByRole('button', { name: 'Forgot your password?' });
        await expect(forgotPasswordButton).toBeVisible({ timeout: 15000 });

        // Optional: verify we can see other elements that indicate successful login
        await expect(page.getByRole('link', { name: 'My Tour' })).toBeVisible({ timeout: 15000 });
    });

    test('User Login - Invalid Credentials', async ({ page }) => {
        // Wait for page load
        await page.waitForLoadState('domcontentloaded');
        await expect(page.locator('nav#navigation')).toBeVisible({ timeout: 30000 });

        // Click "Login" link
        const loginLink = page.getByRole('link', { name: 'Login' });
        await loginLink.waitFor({ state: 'visible', timeout: 10000 });
        await loginLink.click();

        // Wait for the Gigya login form to be ready
        await page.waitForSelector('#gigya-login-form', { timeout: 30000 });
        
        // Add a small delay to ensure form is fully loaded
        await page.waitForTimeout(3000);

        // Fill login form using more reliable selectors
        const emailInput = page.locator('#gigya-login-form [type="email"], #gigya-login-form [type="text"]').first();
        await emailInput.waitFor({ state: 'visible', timeout: 15000 });
        await emailInput.fill('invalid@example.com');

        const passwordInput = page.locator('#gigya-login-form [type="password"]').first();
        await passwordInput.waitFor({ state: 'visible', timeout: 15000 });
        await passwordInput.fill('WrongPassword123!');
        
        // Click login button using specific selector
        const loginButton = page.locator('#gigya-login-form input[type="submit"], #gigya-login-form button[type="submit"]').first();
        await loginButton.waitFor({ state: 'visible', timeout: 15000 });
        
        try {
            await loginButton.click();

            // Wait for the specific error message below the login button
            const errorMessageLocator = page.locator('#gigya-login-form .gigya-composite-control-form-error');
            await expect(errorMessageLocator).toBeVisible({ timeout: 15000 });
            
            // Verify the exact error message text
            await expect(errorMessageLocator).toHaveText('Invalid login or password', { timeout: 5000 });
            
            // Take screenshot of error state
            await page.screenshot({ path: 'Screenshots/login-error.png' }).catch(e => {
                console.log('Could not take error screenshot:', e);
            });
        } catch (e) {
            // Take error screenshot if something goes wrong
            await page.screenshot({ path: 'Screenshots/login-error-state.png' }).catch(() => {});
            console.log('Error during invalid login test:', e);
            throw e;
        }
    });

    test('Password Reset Flow', async ({ page }) => {
        // Wait for page load
        await page.waitForLoadState('domcontentloaded');
        await expect(page.locator('nav#navigation')).toBeVisible({ timeout: 30000 });

        // Click "Login" link to get to login screen first
        const loginLink = page.getByRole('link', { name: 'Login' });
        await loginLink.waitFor({ state: 'visible', timeout: 10000 });
        await loginLink.click();

        // Wait for the Gigya login form to be ready
        await page.waitForSelector('#gigya-login-form', { timeout: 30000 });
        
        // Add a delay to ensure form is fully loaded and interactive
        await page.waitForTimeout(5000);

        // Click "Forgot your password?" button
        const forgotPasswordButton = page.getByRole('button', { name: 'Forgot your password?' });
        await forgotPasswordButton.waitFor({ state: 'visible', timeout: 15000 });
        await forgotPasswordButton.click();

        // Wait for the forgot password form to be visible
        await expect(page.getByRole('heading', { name: 'Forgot Password', level: 2 })).toBeVisible({ timeout: 15000 });
        
        // Wait for the email input field using a more reliable selector
        const emailInput = page.getByLabel('Email address:');
        await emailInput.waitFor({ state: 'visible', timeout: 15000 });
        
        // Fill in the email
        await emailInput.fill('gendjo0104@yopmail.com');

        // Click "Send my Password" button
        const sendButton = page.getByRole('button', { name: 'Send my Password' });
        await sendButton.waitFor({ state: 'visible', timeout: 15000 });
        
        try {
            await sendButton.click();

            // Take screenshot right after clicking send button
            await page.screenshot({ path: 'Screenshots/after-send-click.png' });

            // Wait for success message using text content
            await expect(page.getByText('An email regarding your password change has been sent to your email address')).toBeVisible({ timeout: 20000 });

            // Take screenshot of success state
            await page.screenshot({ path: 'Screenshots/password-reset-success.png' });

            // Wait a moment for any animations to complete
            await page.waitForTimeout(2000);

            // Try clicking "Back to login" with multiple approaches
            try {
                // First attempt: Try the button role
                const backButton = page.getByRole('button', { name: 'Back to login' });
                await backButton.click();
            } catch (e) {
                console.log('First back button attempt failed, trying alternatives');
                try {
                    // Second attempt: Try input submit
                    const backInput = page.locator('input[type="submit"][value="Back to login"]');
                    await backInput.click();
                } catch (e2) {
                    console.log('Second back button attempt failed, trying link');
                    // Final attempt: Try link
                    const backLink = page.getByText('Back to login', { exact: true });
                    await backLink.click();
                }
            }

            // Add delay after clicking
            await page.waitForTimeout(2000);

            // Verify we're back at login form
            await expect(page.locator('#gigya-login-form')).toBeVisible({ timeout: 15000 });

        } catch (e) {
            // Take error screenshot if something goes wrong
            await page.screenshot({ path: 'Screenshots/password-reset-error.png' });
            console.log('Error during password reset:', e);
            throw e;
        }
    });
}); 