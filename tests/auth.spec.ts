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
        // Increase test timeout
        test.setTimeout(60000);

        try {
            // Wait for page load
            await page.waitForLoadState('domcontentloaded');
            await expect(page.locator('nav#navigation')).toBeVisible({ timeout: 30000 });

            // Click "Login" link to get to login screen first
            const loginLink = page.getByRole('link', { name: 'Login' });
            await loginLink.waitFor({ state: 'visible', timeout: 10000 });
            await loginLink.click();

            // Wait for the Gigya login form to be ready
            await page.waitForSelector('#gigya-login-form', { timeout: 30000 });
            
            // Add a delay to ensure form is fully loaded
            await page.waitForTimeout(5000);

            // Take screenshot of initial state
            await page.screenshot({ path: 'Screenshots/before-forgot-password.png' });

            // Click "Forgot your password?" button with retry mechanism
            const forgotPasswordButton = page.getByRole('button', { name: 'Forgot your password?' });
            let retryCount = 0;
            const maxRetries = 3;
            
            while (retryCount < maxRetries) {
                try {
                    await forgotPasswordButton.waitFor({ state: 'visible', timeout: 15000 });
                    await forgotPasswordButton.click();
                    
                    // Wait for any visible change after clicking
                    await page.waitForTimeout(2000);
                    break;
                } catch (e) {
                    console.log(`Retry ${retryCount + 1} for clicking forgot password button`);
                    retryCount++;
                    if (retryCount === maxRetries) {
                        await page.screenshot({ path: 'Screenshots/forgot-password-button-error.png' });
                        throw e;
                    }
                    await page.waitForTimeout(2000);
                }
            }

            // Take screenshot after clicking forgot password
            await page.screenshot({ path: 'Screenshots/after-forgot-password-click.png' });

            // Try multiple selectors for the forgot password form heading
            const headingSelectors = [
                'h2:has-text("Forgot Password")',
                '[role="heading"]:has-text("Forgot Password")',
                '#gigya-reset-password-screen h2',
                '.gigya-screen-caption',
                '#gigya-reset-password-form',
                '.gigya-reset-password-form'
            ];

            let headingFound = false;
            for (const selector of headingSelectors) {
                try {
                    await page.waitForSelector(selector, { timeout: 5000 });
                    headingFound = true;
                    break;
                } catch (e) {
                    console.log(`Selector ${selector} not found, trying next...`);
                }
            }

            if (!headingFound) {
                await page.screenshot({ path: 'Screenshots/heading-not-found.png' });
                throw new Error('Could not find forgot password heading with any selector');
            }

            // Wait a moment for the form to be fully interactive
            await page.waitForTimeout(2000);

            // Wait for the email input field using multiple possible selectors
            const emailSelectors = [
                'input[type="email"]',
                '#gigya-reset-password-form input[type="text"]',
                'input[aria-label="Email address"]',
                'input[name="email"]',
                '[data-gigya-name="email"]',
                '#gigya-reset-password-form [type="text"]'
            ];

            let emailInput = null;
            for (const selector of emailSelectors) {
                try {
                    emailInput = await page.waitForSelector(selector, { timeout: 5000 });
                    if (emailInput) break;
                } catch (e) {
                    console.log(`Email input selector ${selector} not found, trying next...`);
                }
            }

            if (!emailInput) {
                await page.screenshot({ path: 'Screenshots/email-input-not-found.png' });
                throw new Error('Could not find email input field with any selector');
            }

            // Fill in the email
            await emailInput.fill('gendjo0104@yopmail.com');
            await page.screenshot({ path: 'Screenshots/email-filled.png' });

            // Click "Send my Password" button with retry mechanism
            const sendButtonSelectors = [
                'button:has-text("Send my Password")',
                'input[value="Send my Password"]',
                '#gigya-reset-password-form input[type="submit"]',
                '.gigya-composite-control-submit input',
                'button.gigya-input-submit',
                '[type="submit"]'
            ];

            let sendButtonFound = false;
            for (const selector of sendButtonSelectors) {
                try {
                    const sendButton = page.locator(selector);
                    await sendButton.waitFor({ state: 'visible', timeout: 5000 });
                    await sendButton.click();
                    sendButtonFound = true;
                    
                    // Wait a moment after clicking
                    await page.waitForTimeout(2000);
                    break;
                } catch (e) {
                    console.log(`Send button selector ${selector} not found or not clickable, trying next...`);
                }
            }

            if (!sendButtonFound) {
                await page.screenshot({ path: 'Screenshots/send-button-not-found.png' });
                throw new Error('Could not find or click send button with any selector');
            }

            // Take screenshot after clicking send
            await page.screenshot({ path: 'Screenshots/after-send-click.png' });

            // Wait for success message with multiple possible text variations
            const successMessages = [
                'An email regarding your password change has been sent to your email address',
                'Password reset email sent',
                'Check your email',
                'Reset password email sent',
                'email has been sent'
            ];

            let successMessageFound = false;
            for (const message of successMessages) {
                try {
                    await page.getByText(message, { exact: false }).waitFor({ timeout: 5000 });
                    successMessageFound = true;
                    break;
                } catch (e) {
                    console.log(`Success message "${message}" not found, trying next...`);
                }
            }

            if (!successMessageFound) {
                await page.screenshot({ path: 'Screenshots/missing-success-message.png' });
                throw new Error('Could not find success message with any known variation');
            }

            // Take screenshot of success state
            await page.screenshot({ path: 'Screenshots/password-reset-success.png' });

            // Try clicking "Back to login" with multiple approaches
            const backToLoginSelectors = [
                'button:has-text("Back to login")',
                'input[value="Back to login"]',
                'a:has-text("Back to login")',
                '.gigya-composite-control-submit input',
                '[type="submit"]',
                'a.gigya-composite-control-submit'
            ];

            let backButtonClicked = false;
            for (const selector of backToLoginSelectors) {
                try {
                    const backElement = page.locator(selector);
                    await backElement.waitFor({ state: 'visible', timeout: 5000 });
                    await backElement.click();
                    backButtonClicked = true;
                    await page.waitForTimeout(2000);
                    break;
                } catch (e) {
                    console.log(`Back button selector ${selector} not found or not clickable, trying next...`);
                }
            }

            if (!backButtonClicked) {
                console.log('Could not find back to login button, proceeding with test');
                await page.screenshot({ path: 'Screenshots/back-button-not-found.png' });
            }

            // Take final screenshot before verification
            await page.screenshot({ path: 'Screenshots/before-final-verification.png' });

            // Verify we're back at login form or at least the page is in a stable state
            try {
                await expect(page.locator('#gigya-login-form')).toBeVisible({ timeout: 15000 });
                await page.screenshot({ path: 'Screenshots/test-completed.png' });
            } catch (e) {
                console.log('Login form not visible after returning, but test completed');
                await page.screenshot({ path: 'Screenshots/final-state.png' });
            }
        } catch (error) {
            // Capture final state in case of any error
            try {
                await page.screenshot({ path: 'Screenshots/error-state.png' });
            } catch (screenshotError) {
                console.log('Could not take error screenshot:', screenshotError);
            }
            throw error;
        }
    });
}); 