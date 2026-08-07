import type { Request, Response, NextFunction } from "express";
import { SITE_NAME } from "../config/constants";

export function templateLocals(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.locals.currentPath = req.path;
  res.locals.siteName = SITE_NAME;
  res.locals.currentYear = new Date().getFullYear();

  next();
}
