# Dockerfile for Identity Service (builds from repository root)
# Railway Settings: Root Directory = "." (repository root)
#                   Dockerfile Path = "services/identity-svc/Dockerfile"

FROM node:22-alpine AS build

WORKDIR /app

# Copy package files for the service
COPY services/identity-svc/package*.json ./services/identity-svc/
# Copy shared tsconfig
COPY packages/tsconfig ./packages/tsconfig/

# Install dependencies
WORKDIR /app/services/identity-svc
RUN npm install --ignore-scripts

# Copy service source code
COPY services/identity-svc ./

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
COPY --from=build /app/services/identity-svc/dist ./dist
COPY --from=build /app/services/identity-svc/generated ./generated
COPY --from=build /app/services/identity-svc/node_modules ./node_modules
COPY --from=build /app/services/identity-svc/prisma ./prisma

# Expose port
EXPOSE 3000

# Start the application
CMD ["dist/main.js"]
