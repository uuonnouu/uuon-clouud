# Lightweight billing microservice — separate deployment
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev --prefer-offline \
    express express-rate-limit pg drizzle-orm zod passport \
    && npm prune --omit=dev

FROM node:20-alpine
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY server/index.ts server/routes.ts server/db.ts server/security.ts ./server/
RUN npm install -g esbuild && esbuild server/index.ts --bundle --platform=node --format=cjs --outfile=dist/billing.cjs --external:pg
USER node
ENV PORT=5002 NODE_ENV=production
EXPOSE 5002
HEALTHCHECK --interval=30s --timeout=10s --retries=3 CMD wget --quiet --tries=1 --spider http://localhost:5002/health || exit 1
CMD ["node", "dist/billing.cjs"]
