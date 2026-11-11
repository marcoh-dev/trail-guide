import express from "express";
import type { NextFunction, Request, Response } from "express";
import nunjucks from "nunjucks";

import { PORT, PUBLIC_DIR, VIEWS_DIR } from "./config/constants";
import { logger } from "./middlewares/logger";
import { templateLocals } from "./middlewares/templateLocals";
import { closeDB, connectDB } from "./models/db.model";
import adminRouter from "./routes/admin.route";
import apiRouter from "./routes/api.route";
import webSiteRouter from "./routes/webSite.route";

const app = express();

await connectDB();

nunjucks.configure(VIEWS_DIR, {
	autoescape: true,
	express: app,
	noCache: process.env.NODE_ENV !== "production",
});

app.set("view engine", "njk");

app.use(logger);
app.use(templateLocals);
app.use(express.static(PUBLIC_DIR));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
	res.locals.currentPath = req.path;
	next();
});

app.use("/", webSiteRouter);
app.use("/admin", adminRouter);
app.use("/api", apiRouter);

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
