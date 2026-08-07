import { type Request, type Response } from "express";
import {
  getAllTrails,
  addTrail,
  deleteTrail,
  getTrailById,
  updateTrail,
} from "../models/trail.model";
import type { IFormattedTrail, ITrail, ITrailPrototype } from "../models/types";
import { formatDate } from "../utils/formatDate";
import { getAllRegions } from "../models/region.model";
import { createUniqueSlug } from "../utils/slug";
import { cleanHtml } from "../utils/sanitize";

const table = "trails";

export async function listTrails(_req: Request, res: Response) {
  try {
    const trailsData = await getAllTrails();
    const trails: IFormattedTrail[] = trailsData.map((trail) => ({
      ...trail,
      created_at: formatDate(trail.created_at),
    }));

    res.render("admin/list", {
      trails,
    });
  } catch (err) {
    console.error("Failed to fetch trails:", err);
    return res.status(500).json({ error: "Failed to fetch trails" });
  }
}

export async function newTrail(req: Request, res: Response) {
  try {
    const regions = await getAllRegions();
    res.render("admin/form", { regions });
  } catch (err) {
    console.error("Failed to fetch regions:", err);
    res.status(500).json({ error: "Failed to fetch regions" });
  }
}

export async function createTrail(req: Request, res: Response) {
  try {
    const formData = req.body;

    const trailData: ITrailPrototype = {
      ...formData,
      region_id: Number(formData.region_id),
      slug: await createUniqueSlug(formData.title, table),
      distance_km: parseFloat(formData.distance_km),
      description: cleanHtml(formData.description) || null,
      image_url: formData.image_url || null,
      created_at: Math.floor(Date.now() / 1000),
    };
    await addTrail(trailData);

    res.redirect("/admin");
  } catch (err) {
    console.error("Failed to create trail:", err);
    res.status(500).json({ error: "Failed to create trail" });
  }
}

export async function editTrail(req: Request<{ id: number }>, res: Response) {
  try {
    const trailData = await getTrailById(req.params.id);

    if (!trailData) return res.status(404).render("404");

    const regions = await getAllRegions();

    res.render("admin/form", { trail: trailData, regions });
  } catch (err) {
    console.error("Failed to edit trail:", err);
    res.status(500).json({ error: "Failed to edit trail" });
  }
}

export async function updateTrailController(
  req: Request<{ id: number }>,
  res: Response,
) {
  try {
    const formData = req.body;
    const id = req.params.id;

    const trailData: ITrailPrototype = {
      ...formData,
      region_id: Number(formData.region_id),
      slug: await createUniqueSlug(formData.title, table, id),
      distance_km: parseFloat(formData.distance_km),
      description: cleanHtml(formData.description) || null,
      image_url: formData.image_url || null,
      created_at: Math.floor(Date.now() / 1000),
    };

    await updateTrail(id, trailData);

    res.redirect("/admin");
  } catch (err) {
    console.error("Failed to update trail:", err);
    res.status(500).json({ error: "Failed to update trail" });
  }
}

export async function removeTrail(req: Request<{ id: number }>, res: Response) {
  try {
    await deleteTrail(req.params.id);
    //res.status(200).json({ message: "Trail deleted" });
    res.redirect("/admin");
  } catch (err) {
    console.error("Failed to delete trail:", err);
    res.status(500).json({ error: "Failed to delete trail" });
  }
}
