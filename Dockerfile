# ---- Build Stage ----
FROM node:22 AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable
RUN npm install

COPY . .
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.output ./.output

CMD ["node", ".output/server/index.mjs"]