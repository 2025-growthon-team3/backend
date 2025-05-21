import { Router } from "express";
import { createVolunteerApplication } from "../../controllers/helper/volunteer.application.controller";

const router = Router();

// POST /volunteer-applications
router.post("/", createVolunteerApplication);

export default router;
