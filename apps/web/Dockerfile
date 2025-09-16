FROM node:24-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
WORKDIR /app

COPY package.json pnpm-*.yaml turbo.json .npmrc ./

COPY apps/web/package.json ./apps/web/package.json

COPY packages/*/package.json ./packages/

RUN pnpm install --frozen-lockfile

FROM deps AS builder
WORKDIR /app

COPY apps/web ./apps/web
COPY packages ./packages

RUN pnpm turbo build --filter=web

FROM node:24-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nuxt
RUN adduser --system --uid 1001 web

COPY --from=builder --chown=web:nuxt /app/apps/web/.output ./

USER web

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

CMD ["node", "server/index.mjs"]