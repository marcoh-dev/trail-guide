import type { Request, Response } from "express";

import { getDatabaseStructure } from "@/models/base.model";

export async function getDatabaseStructureController(_req: Request, res: Response) {
	try {
		const tables = await getDatabaseStructure();
		res.status(200).json(tables);
	} catch (err) {
		console.error("Could not read database structure:", err);
		res.status(500).send("Could not read database structure");
	}
}
