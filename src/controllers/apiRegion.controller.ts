import type { Request, Response } from "express";
import { getAllRegions, getRegionBySlug } from "../models/region.model";
import { getTrailsByRegionId } from "../models/trail.model";

export async function getRegions(_req: Request, res: Response) {
  try {
    const regionsData = await getAllRegions();
    res.status(200).json(regionsData);
  } catch (err) {
    console.error("Failed to fetch regions:", err);
    return res.status(500).json({ error: "Failed to fetch regions" });
  }
}

export async function getRegion(req: Request<{ slug: string }>, res: Response) {
  try {
    const regionData = await getRegionBySlug(req.params.slug);

    if (!regionData) return res.status(404).json({ error: "Region not found" });

    res.status(200).json(regionData);
  } catch (err) {
    console.error("Failed to fetch region:", err);
    return res.status(500).json({ error: "Failed to fetch region" });
  }
}

export async function getRegionTrails(
  req: Request<{ slug: string }>,
  res: Response,
) {
  try {
    const regionData = await getRegionBySlug(req.params.slug);

    if (!regionData) return res.status(404).json({ error: "Region not found" });

    const id = regionData.id;

    const trailsData = await getTrailsByRegionId(id);

    res.status(200).json(trailsData);
  } catch (err) {
    console.error("Failed to fetch region:", err);
    return res.status(500).json({ error: "Failed to fetch region" });
  }
}
