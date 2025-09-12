# ---------- Base Stage ----------
FROM node:24-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps

COPY ../../package.json ../../pnpm-*.yaml ../../../turbo.json ./

RUN pnpm install --frozen-lockfile

# ---------- Build Stage ----------
FROM deps AS builder

# COPY ../../apps/web ./apps/web
# COPY ../../packages ./packages

# RUN pnpm turbo run build --filter=web

# FROM node:24-alpine AS runner
# WORKDIR /app

# COPY --from=builder /app/apps/web/.output .

# EXPOSE 3000
CMD ["node", "server/index.mjs"]
