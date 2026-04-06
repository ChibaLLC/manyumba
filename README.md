# Manyumba

## Local development without the devcontainer

Install dependencies once:

```bash
pnpm install
```

Bootstrap the local database container and write the required database env values into `apps/web/.env`:

```bash
pnpm dev:start
```

That command will:

- create `apps/web/.env` from `apps/web/.env.example` if it does not exist
- ensure the local Postgres variables are present
- start the dev Postgres container from `docker-compose.dev.yml`
- run the web app database migrations

Then start the apps natively on your machine:

```bash
pnpm dev
```

Stop or reset the local database when needed:

```bash
pnpm dev:stop
pnpm dev:reset
```

## Apps

- `apps/web`: main Nuxt application
- `apps/user-docs`: documentation site
