# services/ticket-svc/Dockerfile
FROM node:22-alpine as deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts

FROM deps as build
WORKDIR /app
COPY . .
RUN npx prisma generate
RUN npm run build

FROM gcr.io/distroless/nodejs22-debian12
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
EXPOSE 3003
CMD ["dist/main.js"]
