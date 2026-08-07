import path from "node:path";

export const PORT = Number(process.env.PORT) || 3000;
export const SITE_NAME = "Trail Guide";
export const PROJECT_ROOT = path.resolve(process.cwd());
export const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");
export const VIEWS_DIR = path.join(PROJECT_ROOT, "views");
export const DB_PATH = path.join(
  PROJECT_ROOT,
  process.env.DB_PATH || "data/trail-guide.db",
);
export const LOG_PATH = path.join(PROJECT_ROOT, "logs", "logs.txt");
