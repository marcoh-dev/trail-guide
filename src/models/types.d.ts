type TId = number;
type TDifficulty = "easy" | "moderate" | "hard";

export interface IRegion {
  id: TId;
  name: string;
  slug: string;
  country: string;
  description?: string;
}

export interface ITrail {
  id: TId;
  title: string;
  slug: string;
  difficulty: TDifficulty;
  distance_km: number;
  description?: string;
  image_url?: string;
  created_at: number;
  region_id: TId;
  region_name: string;
  region_country: string;
}

export interface IFormattedTrail extends ITrail {
  created_at: string;
}
