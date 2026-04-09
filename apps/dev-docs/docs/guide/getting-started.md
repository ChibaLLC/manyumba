# Getting Started

This guide will help you set up your local development environment for Manyumba.

## Prerequisites

- **Node.js** >= 24
- **pnpm** (package manager)
- **Docker** and **Docker Compose**

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/manyumba/manyumba.git
cd manyumba
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Start the local database**

```bash
pnpm dev:start
```

This command will:
- Start a PostgreSQL container via Docker Compose
- Run database migrations
- Set up environment variables

4. **Start the development server**

```bash
pnpm dev
```

This runs all apps in the monorepo in development mode using Turborepo.

## Development Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm dev:start` | Bootstrap local DB container |
| `pnpm dev:stop` | Stop local database containers |
| `pnpm dev:reset` | Reset local database containers |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | Run linters |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm test` | Run tests |

## Next Steps

- Explore the [project structure](./introduction.md#project-structure)
- Check out the main web app documentation
- Review the shared packages
