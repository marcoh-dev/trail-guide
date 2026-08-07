import { getDB } from "./db.model";
import type { ITrail, ITrailPrototype, TId } from "./types";

export async function getAllTrails(): Promise<ITrail[]> {
  const db = getDB();
  return await db.all<ITrail[]>(
    `SELECT 
		trails.*, 
		regions.name as region_name,
		regions.country as region_country
	FROM trails
	INNER JOIN regions
	ON trails.region_id = regions.id`,
  );
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

export async function addTrail(data: ITrailPrototype): Promise<void> {
  const db = getDB();

  await db.run(
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

export async function deleteTrail(id: number): Promise<void> {
  const db = getDB();
  await db.run(`DELETE FROM trails WHERE id = @id`, { "@id": id });
}
