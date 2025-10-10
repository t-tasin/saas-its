# services/reservation-svc/Dockerfile
FROM node:22-alpine as build
WORKDIR /app

# Copy root package files for workspace support
COPY package*.json ./
COPY services/reservation-svc/package*.json ./services/reservation-svc/
COPY packages ./packages/

# Install all dependencies (root + workspace)
RUN npm install --ignore-scripts

# Copy service source
COPY services/reservation-svc ./services/reservation-svc/

# Build the service
WORKDIR /app/services/reservation-svc
RUN npx prisma generate
RUN npm run build

# Prune dev dependencies
WORKDIR /app
RUN npm prune --production

FROM gcr.io/distroless/nodejs22-debian12
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/services/reservation-svc/dist ./dist
COPY --from=build /app/services/reservation-svc/generated ./generated
COPY --from=build /app/services/reservation-svc/node_modules ./node_modules
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/services/reservation-svc/prisma ./prisma
EXPOSE 5003
CMD ["dist/main.js"]

