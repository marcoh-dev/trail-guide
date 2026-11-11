import { Router } from "express";

import { listRegions, showRegion } from "@/controllers/region.controller";
import { listTrails, showTrail } from "@/controllers/trail.controller";

const router = Router();

router.get("/", listTrails);

router.get("/trails/:slug", showTrail);

router.get("/regions", listRegions);

router.get("/regions/:slug", showRegion);

export default router;
