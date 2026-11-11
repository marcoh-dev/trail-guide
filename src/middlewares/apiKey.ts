import type { NextFunction, Request, Response } from "express";

export function requireApiKey(req: Request, res: Response, next: NextFunction) {
	const apiKey = process.env.API_KEY;

	if (!apiKey) {
		console.error("API_KEY is not set");
		return res.status(500).json({ error: "API key is not configured" });
	}

	if (req.get("x-api-key") !== apiKey) {
		return res.status(401).json({ error: "Invalid or missing API key" });
	}

	next();
}
