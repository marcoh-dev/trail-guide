import type { Request, Response } from "express";
import { getAllTrails, getTrailBySlug } from "../models/trail.model";
import { formatDate } from "../utils/formatDate";
import type { IFormattedTrail } from "../models/types";

export async function listTrails(_req: Request, res: Response) {
  try {
    const trailsData = await getAllTrails();
    const trails: IFormattedTrail[] = trailsData.map((trail) => ({
      ...trail,
      created_at: formatDate(trail.created_at),
    }));

    res.render("index", {
      trails,
    });
  } catch (err) {
    console.error("Failed to fetch trails:", err);
    return res.status(500).json({ error: "Failed to fetch trails" });
  }
}

export async function showTrail(req: Request<{ slug: string }>, res: Response) {
  try {
    const trailData = await getTrailBySlug(req.params.slug);

    if (!trailData) return res.status(404).render("404");

    const trail: IFormattedTrail = {
      ...trailData,
      created_at: formatDate(trailData.created_at),
    };

    res.render("trail", {
      trail,
    });
  } catch (err) {
    console.error("Failed to fetch trail:", err);
    return res.status(500).json({ error: "Failed to fetch trail" });
  }
}
