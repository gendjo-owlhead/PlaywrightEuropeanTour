docker build -t playwright-european-tour .# Use official Node.js LTS image
FROM mcr.microsoft.com/playwright:v1.43.1-jammy

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Run Playwright install to ensure browsers are installed
RUN npx playwright install --with-deps

# Default command: run Playwright tests (can be overridden)
CMD ["npx", "playwright", "test"]
