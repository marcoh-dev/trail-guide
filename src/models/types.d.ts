type TId = number;
type TDifficulty = "easy" | "moderate" | "hard";
type TTableName = "trails" | "regions";

export interface IRegion {
  id: TId;
  name: string;
  slug: string;
  country: string;
  description?: string;
}

export interface ITrailPrototype {
  title: string;
  slug: string;
  difficulty: TDifficulty;
  distance_km: number;
  description?: string;
  image_url?: string;
  created_at: number;
  region_id: TId;
}

export interface ITrail extends ITrailPrototype {
  id: TId;
  region_name: string;
  region_country: string;
}

export interface IFormattedTrail extends ITrail {
  created_at: string;
}
