FROM node:20-alpine
WORKDIR /app

# Copy everything first
COPY . .

# Install deps (including devDeps for build)
RUN npm ci --prefer-offline

# Build the app
RUN npm run build

# Remove devDeps to shrink final image
RUN npm prune --omit=dev

# Create uploads directory with correct permissions
RUN mkdir -p /app/uploads && chown -R node:node /app

USER node

ENV NODE_ENV=production
ENV PORT=5001
ENV AI_BACKEND=none

EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5001/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))" || exit 1

CMD ["node", "dist/index.cjs"]
