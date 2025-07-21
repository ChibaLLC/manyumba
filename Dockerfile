FROM node:24 AS builder

WORKDIR /

COPY package.json pnpm-lock.yaml ./
RUN corepack enable

RUN pnpm install

COPY . .
RUN pnpm nuxt prepare && pnpm run build && pnpm prune --prod

CMD ["node", "server/index.mjs"]