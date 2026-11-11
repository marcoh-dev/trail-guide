import { Router } from "express";

import {
	createTrail,
	editTrail,
	listTrails,
	newTrail,
	removeTrail,
	updateTrailController,
} from "@/controllers/admin.controller";

const router = Router();

router.get("/", listTrails);

router.get("/trails/new", newTrail);

router.post("/trails", createTrail);

router.get("/trails/:id/edit", editTrail);

router.post("/trails/:id", updateTrailController);

router.post("/trails/:id/delete", removeTrail);

export default router;
