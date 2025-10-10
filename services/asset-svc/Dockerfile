FROM node:22-alpine AS build
WORKDIR /app

# Copy root package files for workspace support
COPY package*.json ./
COPY services/asset-svc/package*.json ./services/asset-svc/
COPY packages ./packages/

# Install all dependencies (root + workspace)
RUN npm install --ignore-scripts

# Copy service source
COPY services/asset-svc ./services/asset-svc/

# Build the service
WORKDIR /app/services/asset-svc
RUN npx prisma generate
RUN npm run build

# Prune dev dependencies
WORKDIR /app
RUN npm prune --production

FROM gcr.io/distroless/nodejs22-debian12:nonroot
WORKDIR /app
COPY --from=build /app/services/asset-svc/dist ./dist
COPY --from=build /app/services/asset-svc/generated ./generated
COPY --from=build /app/services/asset-svc/node_modules ./node_modules
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3002
USER nonroot
CMD ["dist/main.js"]
