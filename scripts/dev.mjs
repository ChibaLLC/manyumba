#!/usr/bin/env node

import { execSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const COMPOSE_FILE = resolve(ROOT, "docker-compose.dev.yml");
const WEB_ROOT = resolve(ROOT, "apps", "web");
const ENV_FILE = resolve(WEB_ROOT, ".env");
const ENV_EXAMPLE = resolve(WEB_ROOT, ".env.example");
const PROJECT_NAME = "manyumba-dev";

const colors = {
  cyan: (message) => `\x1b[36m${message}\x1b[0m`,
  green: (message) => `\x1b[32m${message}\x1b[0m`,
  yellow: (message) => `\x1b[33m${message}\x1b[0m`,
  red: (message) => `\x1b[31m${message}\x1b[0m`,
};

const log = (message) => console.log(`${colors.cyan("▸")} ${message}`);
const ok = (message) => console.log(`${colors.green("✔")} ${message}`);
const warn = (message) => console.log(`${colors.yellow("⚠")} ${message}`);
const fail = (message) => console.error(`${colors.red("✖")} ${message}`);

const DEFAULTS = {
  DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/manyumba",
  DB_HOST: "localhost",
  DB_PASSWORD: "postgres",
  DB_PORT: "5432",
  DB_USER: "postgres",
  DB_NAME: "manyumba",
};

let composeCommand = null;

function run(command, options = {}) {
  try {
    execSync(command, {
      cwd: ROOT,
      stdio: "inherit",
      ...options,
    });
    return true;
  } catch {
    return false;
  }
}

function ensureEnvFile() {
  mkdirSync(dirname(ENV_FILE), { recursive: true });

  if (!existsSync(ENV_FILE)) {
    if (existsSync(ENV_EXAMPLE)) {
      copyFileSync(ENV_EXAMPLE, ENV_FILE);
      ok("Created apps/web/.env from .env.example");
    } else {
      writeFileSync(ENV_FILE, "", "utf-8");
      ok("Created apps/web/.env");
    }
  }

  let content = readFileSync(ENV_FILE, "utf-8");
  let modified = false;

  for (const [key, value] of Object.entries(DEFAULTS)) {
    const pattern = new RegExp(`^${key}=`, "m");
    if (!pattern.test(content)) {
      content += `\n${key}=${value}`;
      log(`Added ${key} to apps/web/.env`);
      modified = true;
    }
  }

  if (modified) {
    writeFileSync(ENV_FILE, `${content.trimStart()}\n`, "utf-8");
  }

  const finalContent = readFileSync(ENV_FILE, "utf-8");
  for (const line of finalContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex < 1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    process.env[key] = value;
  }
}

function compose(args) {
  return run(`${composeCommand} -f "${COMPOSE_FILE}" -p ${PROJECT_NAME} --env-file "${ENV_FILE}" ${args}`);
}

function detectComposeCommand() {
  const candidates = ["docker compose version", "docker-compose version"];

  for (const candidate of candidates) {
    if (run(candidate, { stdio: "ignore" })) {
      return candidate.replace(/ version$/, "");
    }
  }

  return null;
}

function ensureDocker() {
  log("Checking Docker availability...");
  composeCommand = detectComposeCommand();

  if (!composeCommand) {
    fail("Docker Compose is not available. Install Docker Desktop and ensure `docker compose` or `docker-compose` is on PATH.");
    process.exit(1);
  }

  ok(`Using ${composeCommand}`);
}

function startInfra() {
  log("Starting PostgreSQL container...");
  if (!compose("up -d --wait")) {
    fail("Failed to start PostgreSQL. Check Docker and the compose config.");
    process.exit(1);
  }

  ok(`PostgreSQL is ready on port ${process.env.DB_PORT || "5432"}`);
}

function stopInfra() {
  log("Stopping PostgreSQL container...");
  compose("down");
  ok("Containers stopped");
}

function resetInfra() {
  warn("Destroying PostgreSQL container and volume...");
  compose("down -v");
  ok("Containers and volumes removed");
}

function runMigrations() {
  log("Running web database migrations...");
  if (!run("pnpm --filter web db:migrate")) {
    fail("Database migration failed.");
    process.exit(1);
  }
  ok("Migrations complete");
}

function printSummary() {
  console.log("");
  console.log(colors.cyan("╔══════════════════════════════════════╗"));
  console.log(colors.cyan("║    Manyumba Native Dev Bootstrap    ║"));
  console.log(colors.cyan("╚══════════════════════════════════════╝"));
  console.log("");
  ok(`Env file ready: ${ENV_FILE}`);
  ok(`Database URL: ${process.env.DATABASE_URL}`);
  log("Next step: run `pnpm dev` to start the apps on your host machine.");
}

function printHelp() {
  console.log(`
Usage: node scripts/dev.mjs [option]

  (no args)   Create apps/web/.env if missing, start Postgres, run migrations
  --stop      Stop the dev database container
  --reset     Destroy the dev database volume, restart, and re-run migrations
  --help      Show this help
`);
}

function main() {
  const [arg] = process.argv.slice(2);

  if (arg === "--help" || arg === "-h") {
    printHelp();
    process.exit(0);
  }

  ensureEnvFile();
  ensureDocker();

  if (arg === "--stop") {
    stopInfra();
    process.exit(0);
  }

  if (arg === "--reset") {
    resetInfra();
    startInfra();
    runMigrations();
    printSummary();
    process.exit(0);
  }

  startInfra();
  runMigrations();
  printSummary();
}

main();