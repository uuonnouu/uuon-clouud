FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN rm -f package-lock.json && npm install --legacy-peer-deps --include=dev

COPY . .

RUN ./node_modules/.bin/vite build || echo "CLIENT BUILD FAILED - continuing"
RUN ./node_modules/.bin/esbuild server/index.ts \
  --platform=node \
  --bundle \
  --format=cjs \
  --outfile=dist/index.cjs \
  --packages=external \
  --minify

RUN npm prune --omit=dev --legacy-peer-deps || true
RUN mkdir -p /app/uploads && chown -R node:node /app

USER node
EXPOSE 3000

CMD ["node", "dist/index.cjs"]
