import express from "express";
import nunjucks from "nunjucks";
import { viewsDir, publicDir, port } from "./config/constants";
import { connectDB, closeDB, getDB } from "./models/db";

const app = express();

await connectDB();

const njk = nunjucks.configure(viewsDir, { autoescape: true, express: app });
nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.set("view engine", "njk");

app.use(express.static(publicDir));

app.get("/", (_req, res) => {
  res.render("index", {
    test: "Hello",
  });
});

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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
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
