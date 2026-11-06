import { getDB } from "./db.model";
import type { IRegion } from "./types";

export async function getAllRegions(): Promise<IRegion[]> {
  const db = getDB();
  return await db.all<IRegion[]>("SELECT * FROM regions");
}

export async function getRegionBySlug(
  slug: string,
): Promise<IRegion | undefined> {
  const db = getDB();
  const regions = await db.all<IRegion[]>(
    `SELECT * FROM regions WHERE slug = @slug`,
    {
      "@slug": slug,
    },
  );
  return regions.find((region) => region.slug === slug);
}

export async function getRegionById(id: number): Promise<IRegion | undefined> {
  const db = getDB();
  return await db.get<IRegion>(`SELECT * FROM regions WHERE id = @id`, {
    "@id": id,
  });
}
