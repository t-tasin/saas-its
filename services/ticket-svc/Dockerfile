# Dockerfile for Ticket Service (builds from repository root)
# Railway Settings: Root Directory = "." (repository root)
#                   Dockerfile Path = "services/ticket-svc/Dockerfile"

FROM node:22-alpine AS build

WORKDIR /app

# Copy package files for the service
COPY services/ticket-svc/package*.json ./services/ticket-svc/
# Copy shared tsconfig
COPY packages/tsconfig ./packages/tsconfig/

# Install dependencies
WORKDIR /app/services/ticket-svc
RUN npm install --ignore-scripts

# Copy service source code
COPY services/ticket-svc ./

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
COPY --from=build /app/services/ticket-svc/dist ./dist
COPY --from=build /app/services/ticket-svc/generated ./generated
COPY --from=build /app/services/ticket-svc/node_modules ./node_modules
COPY --from=build /app/services/ticket-svc/prisma ./prisma

# Expose port
EXPOSE 3002

# Start the application
CMD ["dist/main.js"]
