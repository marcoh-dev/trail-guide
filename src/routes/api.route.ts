import { Router } from "express";
import { getDatabaseStructureController } from "../controllers/apiCommon.controller";
import {
  getTrails,
  getTrail,
  removeTrail,
  createTrail,
} from "../controllers/apiTrail.controller";
import {
  getRegions,
  getRegion,
  getRegionTrails,
} from "../controllers/apiRegion.controller";

const router = Router();

router.get("/trails", getTrails);

router.get("/trails/:slug", getTrail);

router.get("/regions", getRegions);

router.get("/regions/:slug", getRegion);

router.get("/regions/:slug/trails", getRegionTrails);

router.post("/trails", createTrail);

router.delete("/trails/:id", removeTrail);
/*



router.patch("/trails/:id", updateTrail)
*/

router.get("/dbstructure", getDatabaseStructureController);

export default router;

/*
POST /api/trails creates a trail from a JSON body. Respond with 201 and the created resource.
PATCH /api/trails/:id updates the given fields. Respond with 200 and the updated resource, or 404.
DELETE /api/trails/:id deletes the trail. Respond with 204, or 404 if it does not exist.
*/
