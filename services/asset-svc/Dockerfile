# Dockerfile for Asset Service (builds from repository root)
# Railway Settings: Root Directory = "." (repository root)
#                   Dockerfile Path = "services/asset-svc/Dockerfile"

FROM node:22-alpine AS build

WORKDIR /app

# Copy package files for the service
COPY services/asset-svc/package*.json ./services/asset-svc/
# Copy shared tsconfig
COPY packages/tsconfig ./packages/tsconfig/

# Install dependencies
WORKDIR /app/services/asset-svc
RUN npm install --ignore-scripts

# Copy service source code
COPY services/asset-svc ./

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Production stage
FROM gcr.io/distroless/nodejs22-debian12:nonroot

WORKDIR /app

# Copy built application
COPY --from=build /app/services/asset-svc/dist ./dist
COPY --from=build /app/services/asset-svc/generated ./generated
COPY --from=build /app/services/asset-svc/node_modules ./node_modules
COPY --from=build /app/services/asset-svc/prisma ./prisma

# Expose port
EXPOSE 3003

# Start the application
CMD ["dist/main.js"]
