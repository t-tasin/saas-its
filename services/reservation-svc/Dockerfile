# Dockerfile for Reservation Service (builds from repository root)
# Railway Settings: Root Directory = "." (repository root)
#                   Dockerfile Path = "services/reservation-svc/Dockerfile"

FROM node:22-alpine AS build

WORKDIR /app

# Copy package files for the service
COPY services/reservation-svc/package*.json ./services/reservation-svc/
# Copy shared tsconfig
COPY packages/tsconfig ./packages/tsconfig/

# Install dependencies
WORKDIR /app/services/reservation-svc
RUN npm install --ignore-scripts

# Copy service source code
COPY services/reservation-svc ./

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Production stage
FROM gcr.io/distroless/nodejs22-debian12:latest

WORKDIR /app

# Copy built application
COPY --from=build /app/services/reservation-svc/dist ./dist
COPY --from=build /app/services/reservation-svc/generated ./generated
COPY --from=build /app/services/reservation-svc/node_modules ./node_modules
COPY --from=build /app/services/reservation-svc/prisma ./prisma

# Expose port
EXPOSE 5003

# Start the application
CMD ["dist/main.js"]
