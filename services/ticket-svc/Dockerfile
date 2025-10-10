# Railway-specific Dockerfile for Ticket Service
# This builds from within the service directory

FROM node:22-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (skip postinstall scripts that need source code)
RUN npm install --production --ignore-scripts

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM gcr.io/distroless/nodejs22-debian12:nonroot

WORKDIR /app

# Copy built application
COPY --from=build /app/dist ./dist
COPY --from=build /app/generated ./generated
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma

# Expose port
EXPOSE 3002

# Start the application
CMD ["dist/main.js"]

