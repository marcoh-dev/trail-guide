import { getDB } from "./db.model";
import type { ITrail, ITrailPrototype, TId, TTrailFilters } from "./types";

export async function getAllTrails(filters?: TTrailFilters): Promise<ITrail[]> {
  const db = getDB();

  let query = `SELECT 
		trails.*, 
		regions.name as region_name,
		regions.country as region_country
	FROM trails
	INNER JOIN regions
	ON trails.region_id = regions.id`;

  const conditions: string[] = [];
  const params: Record<string, unknown> = {};

  if (filters?.difficulty) {
    conditions.push("difficulty = @difficulty");
    params["@difficulty"] = filters.difficulty;
  }

  if (filters?.region) {
    conditions.push("regions.slug = @region");
    params["@region"] = filters.region;
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  return db.all(query, params);
}

export async function getTrailBySlug(
  slug: string,
): Promise<ITrail | undefined> {
  const db = getDB();
  return await db.get<ITrail>(
    `SELECT
		trails.*,
		regions.name AS region_name,
		regions.country AS region_country
	FROM trails
	INNER JOIN regions
	ON trails.region_id = regions.id
	WHERE trails.slug = @slug`,
    {
      "@slug": slug,
    },
  );
}

export async function getTrailById(id: number): Promise<ITrail | undefined> {
  const db = getDB();
  return await db.get<ITrail>(
    `SELECT
		trails.*,
		regions.name AS region_name,
		regions.country AS region_country
	FROM trails
	INNER JOIN regions
	ON trails.region_id = regions.id
	WHERE trails.id = @id`,
    {
      "@id": id,
    },
  );
}

export async function getTrailsByRegionId(regionId: TId): Promise<ITrail[]> {
  const db = getDB();
  return await db.all<ITrail[]>(
    `SELECT 
		trails.*, 
		regions.name as region_name,
		regions.country as region_country
	FROM trails
	INNER JOIN regions
	ON trails.region_id = regions.id
	WHERE region_id = @region_id`,
    {
      "@region_id": regionId,
    },
  );
}

export async function addTrail(data: ITrailPrototype): Promise<TId> {
  const db = getDB();

  const result = await db.run(
    `INSERT INTO trails (
		region_id,
		title,
		slug,
		difficulty,
		distance_km,
		description,
		image_url,
		created_at
	) VALUES (
		@region_id,
		@title,
		@slug,
		@difficulty,
		@distance_km,
		@description,
		@image_url,
		@created_at
	 )`,
    {
      "@region_id": data.region_id,
      "@title": data.title,
      "@slug": data.slug,
      "@difficulty": data.difficulty,
      "@distance_km": data.distance_km,
      "@description": data.description,
      "@image_url": data.image_url,
      "@created_at": data.created_at,
    },
  );

  return result.lastID!;
}

export async function updateTrail(
  id: number,
  data: ITrailPrototype,
): Promise<void> {
  const db = getDB();

  await db.run(
    `UPDATE trails
    SET 
	 	region_id = @region_id,
		title = @title,
		slug = @slug,
		difficulty = @difficulty,
		distance_km = @distance_km,
		description = @description,
		image_url = @image_url
    WHERE id = @id`,
    {
      "@region_id": data.region_id,
      "@title": data.title,
      "@slug": data.slug,
      "@difficulty": data.difficulty,
      "@distance_km": data.distance_km,
      "@description": data.description,
      "@image_url": data.image_url,
      "@id": id,
    },
  );
}

export async function deleteTrail(id: number): Promise<boolean> {
  const db = getDB();
  const result = await db.run(`DELETE FROM trails WHERE id = @id`, {
    "@id": id,
  });

  return result.changes! > 0;
}
