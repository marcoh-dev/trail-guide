import { Router } from "express";

import { getDatabaseStructureController } from "@/controllers/apiCommon.controller";
import { getRegion, getRegions, getRegionTrails } from "@/controllers/apiRegion.controller";
import {
	createTrail,
	getTrail,
	getTrails,
	removeTrail,
	updateTrailController,
} from "@/controllers/apiTrail.controller";
import { requireApiKey } from "@/middlewares/apiKey";

const router = Router();

router.get("/trails", getTrails);

router.get("/trails/:slug", getTrail);

router.get("/regions", getRegions);

router.get("/regions/:slug", getRegion);

router.get("/regions/:slug/trails", getRegionTrails);

router.post("/trails", requireApiKey, createTrail);

router.patch("/trails/:id", requireApiKey, updateTrailController);

router.delete("/trails/:id", requireApiKey, removeTrail);

router.get("/dbstructure", getDatabaseStructureController);

router.use((_req, res) => {
	res.status(404).json({ error: "Not found" });
});

export default router;
