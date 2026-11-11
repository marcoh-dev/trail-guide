import type { Request, Response } from "express";

import { getAllRegions, getRegionBySlug } from "@/models/region.model";
import { getTrailsByRegionId } from "@/models/trail.model";

export async function listRegions(_req: Request, res: Response) {
	try {
		const regions = await getAllRegions();
		res.render("regions", {
			regions,
		});
	} catch (err) {
		console.error("Failed to fetch regions:", err);
		return res.status(500).json({ error: "Failed to fetch regions" });
	}
}

export async function showRegion(req: Request<{ slug: string }>, res: Response) {
	try {
		const region = await getRegionBySlug(req.params.slug);

		if (!region) return res.status(404).render("404");

		const trails = await getTrailsByRegionId(region.id);

		res.render("region", {
			region,
			trails,
		});
	} catch (err) {
		console.error("Failed to fetch region:", err);
		return res.status(500).json({ error: "Failed to fetch region" });
	}
}
