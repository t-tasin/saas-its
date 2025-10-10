# Dockerfile for Asset Service
# Railway: Set Root Directory to "services/asset-svc"

FROM node:22-alpine AS build

WORKDIR /app

# Copy package files
COPY services/asset-svc/package*.json ./

# Install all dependencies (including dev for build)
RUN npm install --ignore-scripts

# Copy source code
COPY services/asset-svc .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Production stage
FROM node:22-alpine

WORKDIR /app

# Install OpenSSL 1.1 compatibility for Prisma
RUN apk add --no-cache openssl1.1-compat

# Copy built application
COPY --from=build /app/dist ./dist
COPY --from=build /app/generated ./generated
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma

# Expose port
EXPOSE 3003

# Start the application
CMD ["node", "dist/main.js"]
