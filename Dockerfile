FROM node:20-slim

# Install dependencies for Playwright
RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Ensure Playwright browser is stored in a shared directory accessible by all users
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source
COPY . .

# Generate Prisma client
RUN yarn db:generate

# Build TypeScript
RUN yarn build

# Install Playwright browser and dependencies globally
RUN npx playwright install --with-deps chromium && \
    chmod -R 777 /ms-playwright

# Run as non-root user
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/index.js"]
