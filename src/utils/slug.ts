import { slugExists } from "@/models/base.model";
import type { TTableName } from "@/models/types";

export async function createUniqueSlug(
	title: string,
	table: TTableName,
	excludeId?: number,
): Promise<string> {
	const baseSlug = slugify(title);

	let slug = baseSlug;
	let counter = 1;

	while (await slugExists(slug, table, excludeId)) {
		slug = `${baseSlug}-${counter++}`;
	}

	return slug;
}

function slugify(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}
