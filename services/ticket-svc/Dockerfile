# services/ticket-svc/Dockerfile
FROM node:22-alpine as build
WORKDIR /app

# Copy root package files for workspace support
COPY package*.json ./
COPY services/ticket-svc/package*.json ./services/ticket-svc/
COPY packages ./packages/

# Install all dependencies (root + workspace)
RUN npm install --ignore-scripts

# Copy service source
COPY services/ticket-svc ./services/ticket-svc/

# Build the service
WORKDIR /app/services/ticket-svc
RUN npx prisma generate
RUN npm run build

# Prune dev dependencies
WORKDIR /app
RUN npm prune --production

FROM gcr.io/distroless/nodejs22-debian12
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/services/ticket-svc/dist ./dist
COPY --from=build /app/services/ticket-svc/generated ./generated
COPY --from=build /app/services/ticket-svc/node_modules ./node_modules
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/services/ticket-svc/prisma ./prisma
EXPOSE 3003
CMD ["dist/main.js"]
