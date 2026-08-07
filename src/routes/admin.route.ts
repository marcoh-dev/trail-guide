import { Router } from "express";
import {
  listTrails,
  newTrail,
  createTrail,
  editTrail,
  updateTrailController,
  removeTrail,
} from "../controllers/admin.controller";

const router = Router();

router.get("/", listTrails);

router.get("/trails/new", newTrail);

router.post("/trails", createTrail);

router.get("/trails/:id/edit", editTrail);

router.post("/trails/:id", updateTrailController);

router.post("/trails/:id/delete", removeTrail);

export default router;
