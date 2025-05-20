import { Router } from "express";
import { createInstitution } from "../../controllers/institution.controller";

const institutionRouter = Router();

institutionRouter.post("/", createInstitution);

export default institutionRouter;
