# Use official Node.js LTS image
FROM node:20-alpine AS base

# Install dependencies for Prisma (OpenSSL)
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies (use npm install for monorepo compatibility)
RUN npm install --omit=dev && \
    npm cache clean --force

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY src ./src/

# Build TypeScript
RUN npm install -D typescript tsx && \
    npm run build

# Production stage
FROM node:20-alpine AS production

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy built files and dependencies from base stage
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/package*.json ./
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/generated ./generated

# Copy entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3400

# Expose port
EXPOSE 3400

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3400/healthz', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the service with entrypoint script
CMD ["/app/entrypoint.sh"]

