import type { Request, Response } from "express";
import {
  getAllTrails,
  getTrailBySlug,
  deleteTrail,
  addTrail,
} from "../models/trail.model";
import type {
  TDifficulty,
  TTrailFilters,
  ITrailPrototype,
} from "../models/types";
import { DIFFICULTIES } from "../config/constants";
import { createUniqueSlug } from "../utils/slug";
import { cleanHtml } from "../utils/sanitize";

const table = "trails";

export async function getTrails(req: Request, res: Response) {
  try {
    const { difficulty, region } = req.query;

    const filters: TTrailFilters = {
      difficulty: difficulty as TDifficulty,
      region: region as string | undefined,
    };

    if (difficulty && !DIFFICULTIES.includes(difficulty as TDifficulty)) {
      return res.status(400).json({
        error: `Invalid difficulty. Must be one of: ${DIFFICULTIES.join(", ")}`,
      });
    }

    const trailsData = await getAllTrails(filters);
    res.status(200).json(trailsData);
  } catch (err) {
    console.error("Failed to fetch trails:", err);
    return res.status(500).json({ error: "Failed to fetch trails" });
  }
}

export async function getTrail(req: Request<{ slug: string }>, res: Response) {
  try {
    const trailData = await getTrailBySlug(req.params.slug);

    if (!trailData) return res.status(404).json("Trail not found");

    res.status(200).json(trailData);
  } catch (err) {
    console.error("Failed to fetch trail:", err);
    return res.status(500).json({ error: "Failed to fetch trail" });
  }
}

export async function createTrail(req: Request, res: Response) {
  try {
    const formData = req.body;

    // required: title, difficulty, distance_km, region_id
    if (
      !formData.title ||
      !formData.difficulty ||
      !formData.distance_km ||
      !formData.region_id
    )
      res.status(400).json("Missing required fields.");

    const trailData: ITrailPrototype = {
      ...formData,
      region_id: Number(formData.region_id),
      slug: await createUniqueSlug(formData.title, table),
      distance_km: parseFloat(formData.distance_km),
      description: cleanHtml(formData.description) || null,
      image_url: formData.image_url || null,
      created_at: Math.floor(Date.now() / 1000),
    };

    // check again for empty string, distance_km = 0 etc.

    await addTrail(trailData);
  } catch (err) {
    console.error("Failed to create trail:", err);
    res.status(500).json({ error: "Failed to create trail" });
  }
}

export async function removeTrail(req: Request<{ id: number }>, res: Response) {
  try {
    const foundTrail = await deleteTrail(req.params.id);

    if (!foundTrail) return res.status(404).json("Trail not found");

    res.status(204).send();
  } catch (err) {
    console.error("Failed to delete trail:", err);
    res.status(500).json({ error: "Failed to delete trail" });
  }
}
