import express from "express";
import nunjucks from "nunjucks";
import { VIEWS_DIR, PUBLIC_DIR, PORT } from "./config/constants";
import { connectDB, closeDB, getDB } from "./models/db.model";
import webSiteRouter from "./routes/webSite.route";
import adminRouter from "./routes/admin.route";
import { logger } from "./middlewares/logger";
import { templateLocals } from "./middlewares/templateLocals";
import type { Request, Response, NextFunction } from "express";

const app = express();

await connectDB();

const njk = nunjucks.configure(VIEWS_DIR, {
  autoescape: true,
  express: app,
  noCache: process.env.NODE_ENV !== "production",
});

app.set("view engine", "njk");

app.use(logger);
app.use(templateLocals);
app.use(express.static(PUBLIC_DIR));
app.use(express.urlencoded({ extended: true }));
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.currentPath = req.path;
  next();
});

app.use("/", webSiteRouter);
app.use("/admin", adminRouter);

app.get("/api/dbstructure", async (_req, res) => {
  const db = getDB();
  try {
    const tables = await db.all(`
      SELECT name, sql
      FROM sqlite_master
      WHERE type = 'table'
      ORDER BY name;
    `);

    res.json(tables);
  } catch (err) {
    console.error(err);
    res.status(500).send("Could not read database structure");
  }
});

app.use((_req, res) => {
  res.status(404).render("404");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received. Closing database connection...");
  await closeDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Closing database connection...");
  await closeDB();
  process.exit(0);
});
