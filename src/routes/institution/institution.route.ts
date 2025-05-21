import { Router } from "express";
import { createInstitution } from "@/controllers/institution/institution.create.controller";
import { getAllInstitutions } from "@/controllers/institution/institution.get.controller";

const institutionRouter = Router();

institutionRouter.post("/", createInstitution);
institutionRouter.get("/location", getAllInstitutions);

export default institutionRouter;
