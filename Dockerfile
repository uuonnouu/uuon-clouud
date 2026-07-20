FROM node:20-alpine

WORKDIR /app
ENV PUPPETEER_SKIP_DOWNLOAD=true
ARG CACHEBUST=1

COPY package*.json ./

RUN npm install --include=dev

COPY . .

RUN npm run build && npm prune --omit=dev

RUN mkdir -p /app/uploads && chown -R node:node /app

USER node

ENV NODE_ENV=production
ENV PORT=5001

EXPOSE 5001

CMD ["npm", "start"]
