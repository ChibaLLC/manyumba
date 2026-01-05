FROM node:24-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
WORKDIR /app

COPY package.json turbo.json .npmrc pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY *.config.* ./

RUN pnpm install --frozen-lockfile --ignore-scripts

FROM deps AS builder
WORKDIR /app

COPY apps/web ./apps/web
COPY packages ./packages

ENV NODE_OPTIONS=--max-old-space-size=4096

RUN pnpm nuxt prepare && pnpm turbo build --filter=web

FROM node:24-alpine AS runner
WORKDIR /app

RUN corepack enable

COPY --from=builder --chown=web:nuxt /app/apps/web/.output ./.output
COPY --from=builder /app/apps/web/server/db/ ./apps/web/server/db
COPY --from=builder /app/apps/web/drizzle.config.ts ./apps/web/drizzle.config.ts
COPY --from=builder /app/apps/web/entrypoint.sh ./apps/web/entrypoint.sh

RUN chmod +x ./apps/web/entrypoint.sh

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

WORKDIR /app/apps/web
CMD ["./entrypoint.sh"]