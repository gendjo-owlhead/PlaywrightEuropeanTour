# Playwright Testing Prompt Guide

## Task Description
Create end-to-end testing solutions using Playwright with Node.js and TypeScript, following established best practices from the Playwright documentation. The solution should include proper test structure, page object models, fixtures, parallel execution considerations, and reporting capabilities.

## Technical Requirements

### Core Technologies
- Playwright v1.40.0 or newer
- Node.js v18 or newer
- TypeScript v5.0 or newer
- VS Code with Playwright Test extension for development

### Project Setup
1. Initialize a new project with proper TypeScript configuration
2. Set up Playwright using the official installer with recommended browsers (Chromium, Firefox, WebKit)
3. Configure proper directory structure following the Page Object Model pattern
4. Implement intelligent waiting strategies rather than arbitrary timeouts

## Expected Deliverables

### Project Structure
```
project-root/
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── tests/
│   ├── example.spec.ts
│   └── advanced-example.spec.ts
├── page-objects/
│   ├── BasePage.ts
│   └── FeaturePage.ts
├── fixtures/
│   └── test-fixtures.ts
└── test-results/
    └── (auto-generated reports)
```

### Configuration Requirements
- Implement proper timeouts for actions, navigation, and tests
- Configure screenshot capturing on failure
- Set up test parallelization with appropriate worker count
- Configure test retry logic for flaky tests
- Implement proper reporter configuration (HTML, JSON)

### Testing Patterns to Include
1. Page Object Models for maintainable test code
2. Custom fixtures for reusable authentication and context setup
3. API testing capabilities alongside UI testing
4. Visual regression testing setup
5. Mobile viewport emulation tests
6. Accessibility testing integration

### Test Cases Implementation Guidelines
- Tests should be independent and atomic
- Use proper assertions with descriptive messages
- Implement proper test isolation
- Use data-test attributes for selectors whenever possible
- Implement proper error handling and logging
- Avoid sleep/timeout-based solutions

## Best Practices Checklist

### Test Structure
- [ ] Use test.describe for logical test grouping
- [ ] Implement proper beforeEach/afterEach hooks
- [ ] Use test.skip() and test.fixme() for test maintenance
- [ ] Tag tests appropriately for organized test runs

### Automation Reliability
- [ ] Use auto-waiting capabilities instead of explicit waits
- [ ] Implement resilient selectors (data-testid over CSS/XPath)
- [ ] Properly handle dialogs and popups
- [ ] Account for dynamic content loading

### Performance Considerations
- [ ] Configure proper parallelization settings
- [ ] Use request interception for faster tests when appropriate
- [ ] Implement smart retry logic for flaky elements
- [ ] Consider using browser contexts over new browser instances

### Code Quality
- [ ] Follow TypeScript best practices with proper types
- [ ] Implement clear documentation for custom helpers and fixtures
- [ ] Apply consistent code formatting (ESLint, Prettier)
- [ ] Create reusable test utilities for common actions

## Example Implementation

Please provide working examples of:
1. A basic test file with proper test structure
2. A Page Object Model implementation
3. Custom fixture implementation
4. API testing example
5. Configuration file with best practices applied
6. Visual testing implementation

## Advanced Requirements
- CI/CD integration recommendations
- Cross-browser testing strategy
- Mobile testing approach
- Performance testing capabilities
- Accessibility testing implementation