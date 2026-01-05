FROM node:24-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile

FROM deps AS builder
WORKDIR /app

COPY apps/docs ./apps/docs
COPY packages ./packages

ENV NODE_OPTIONS=--max-old-space-size=4096
RUN pnpm turbo build --filter=docs

FROM node:24-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nuxt
RUN adduser --system --uid 1001 web

COPY --from=builder --chown=web:nuxt /app/apps/docs/.output ./

USER web

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

CMD ["node", "server/index.mjs"]