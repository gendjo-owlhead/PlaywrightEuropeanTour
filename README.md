# PlaywrightEuropeanTour

Automated testing suite for the European Tour website using Playwright.

## Overview

This project contains automated end-to-end tests for the European Tour website's authentication flows, including:
- User Registration
- Login with valid credentials
- Login with invalid credentials
- Password reset flow

## Setup

1. Clone the repository:
```bash
git clone https://github.com/gendjo-owlhead/PlaywrightEuropeanTour.git
cd PlaywrightEuropeanTour
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

To run all tests:
```bash
npx playwright test
```

To run tests in headed mode:
```bash
npx playwright test --headed
```

To run a specific test file:
```bash
npx playwright test tests/auth.spec.ts
```

## Test Reports

After running tests, you can view the HTML report:
```bash
npx playwright show-report
```

## Screenshots

Test screenshots are saved in the `Screenshots` directory when tests are executed.

## Project Structure

```
├── tests/
│   └── auth.spec.ts    # Authentication tests
├── Screenshots/        # Test screenshots
├── playwright.config.ts # Playwright configuration
└── package.json        # Project dependencies
``` 