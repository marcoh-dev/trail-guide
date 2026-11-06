import type { Request, Response } from "express";
import {
  getAllTrails,
  getTrailBySlug,
  getTrailById,
  addTrail,
  updateTrail,
  deleteTrail,
} from "../models/trail.model";
import { getRegionById } from "../models/region.model";
import type {
  ITrailPrototype,
  TDifficulty,
  TTrailFilters,
} from "../models/types";
import { DIFFICULTIES } from "../config/constants";
import { createUniqueSlug } from "../utils/slug";
import { cleanHtml } from "../utils/sanitize";

const table = "trails";

const REQUIRED_FIELDS = ["title", "difficulty", "distance_km", "region_id"];

type TTrailInput = Partial<Record<keyof ITrailPrototype, unknown>>;

async function validateTrailInput(input: TTrailInput): Promise<string | null> {
  if (
    input.title !== undefined &&
    (typeof input.title !== "string" || input.title.trim() === "")
  ) {
    return "title must be a non-empty string";
  }

  if (
    input.difficulty !== undefined &&
    !DIFFICULTIES.includes(input.difficulty as TDifficulty)
  ) {
    return `difficulty must be one of: ${DIFFICULTIES.join(", ")}`;
  }

  if (input.distance_km !== undefined && !(Number(input.distance_km) > 0)) {
    return "distance_km must be a number greater than 0";
  }

  if (
    input.region_id !== undefined &&
    !(await getRegionById(Number(input.region_id)))
  ) {
    return "region_id must reference an existing region";
  }

  return null;
}

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

    if (!trailData) return res.status(404).json({ error: "Trail not found" });

    res.status(200).json(trailData);
  } catch (err) {
    console.error("Failed to fetch trail:", err);
    return res.status(500).json({ error: "Failed to fetch trail" });
  }
}

export async function createTrail(req: Request, res: Response) {
  try {
    const input: TTrailInput = req.body ?? {};

    const missingFields = REQUIRED_FIELDS.filter(
      (field) =>
        input[field as keyof TTrailInput] === undefined ||
        input[field as keyof TTrailInput] === "",
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const validationError = await validateTrailInput(input);

    if (validationError)
      return res.status(400).json({ error: validationError });

    const title = String(input.title).trim();

    const trailData: ITrailPrototype = {
      title,
      slug: await createUniqueSlug(title, table),
      difficulty: input.difficulty as TDifficulty,
      distance_km: Number(input.distance_km),
      region_id: Number(input.region_id),
      description: cleanHtml(input.description as string | undefined),
      image_url: (input.image_url as string | undefined) || null,
      created_at: Math.floor(Date.now() / 1000),
    };

    const id = await addTrail(trailData);
    const createdTrail = await getTrailById(id);

    res.status(201).json(createdTrail);
  } catch (err) {
    console.error("Failed to create trail:", err);
    res.status(500).json({ error: "Failed to create trail" });
  }
}

export async function updateTrailController(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = Number(req.params.id);
    const existingTrail = await getTrailById(id);

    if (!existingTrail) {
      return res.status(404).json({ error: "Trail not found" });
    }

    const input: TTrailInput = req.body ?? {};

    const hasUpdates = [...REQUIRED_FIELDS, "description", "image_url"].some(
      (field) => input[field as keyof TTrailInput] !== undefined,
    );

    if (!hasUpdates) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const validationError = await validateTrailInput(input);

    if (validationError)
      return res.status(400).json({ error: validationError });

    const title =
      input.title !== undefined
        ? String(input.title).trim()
        : existingTrail.title;

    const trailData: ITrailPrototype = {
      title,
      slug:
        title !== existingTrail.title
          ? await createUniqueSlug(title, table, id)
          : existingTrail.slug,
      difficulty: (input.difficulty as TDifficulty) ?? existingTrail.difficulty,
      distance_km:
        input.distance_km !== undefined
          ? Number(input.distance_km)
          : existingTrail.distance_km,
      region_id:
        input.region_id !== undefined
          ? Number(input.region_id)
          : existingTrail.region_id,
      description:
        input.description !== undefined
          ? cleanHtml(input.description as string | null)
          : existingTrail.description,
      image_url:
        input.image_url !== undefined
          ? (input.image_url as string | null) || null
          : existingTrail.image_url,
      created_at: existingTrail.created_at,
    };

    await updateTrail(id, trailData);
    const updatedTrail = await getTrailById(id);

    res.status(200).json(updatedTrail);
  } catch (err) {
    console.error("Failed to update trail:", err);
    res.status(500).json({ error: "Failed to update trail" });
  }
}

export async function removeTrail(req: Request<{ id: string }>, res: Response) {
  try {
    const foundTrail = await deleteTrail(Number(req.params.id));

    if (!foundTrail) return res.status(404).json({ error: "Trail not found" });

    res.status(204).send();
  } catch (err) {
    console.error("Failed to delete trail:", err);
    res.status(500).json({ error: "Failed to delete trail" });
  }
}
