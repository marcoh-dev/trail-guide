import path from "node:path";

export const port = Number(process.env.PORT) || 3000;

export const projectRoot = path.resolve(process.cwd());
export const publicDir = path.join(projectRoot, "public");
export const viewsDir = path.join(projectRoot, "views");
export const dbPath = path.join(
  projectRoot,
  process.env.DB_PATH || "data/trail-guide.db",
);
