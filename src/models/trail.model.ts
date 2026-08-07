import { getDB } from "./db.model";
import type { ITrail, TId } from "./types";

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
