import { getDB } from "./db.model";
import type { TTableName } from "./types";

export async function slugExists(
  slug: string,
  table: TTableName,
  excludeId?: number,
): Promise<boolean> {
  const db = getDB();

  let query = `
    SELECT 1
    FROM ${table}
    WHERE slug = @slug
  `;

  if (excludeId !== undefined) {
    query += " AND id != @excludeId";
  }

  query += " LIMIT 1";

  const result = await db.get(query, {
    "@slug": slug,
    "@excludeId": excludeId,
  });

  return result !== undefined;
}
