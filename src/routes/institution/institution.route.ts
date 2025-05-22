import { Router } from "express";
import { createInstitution } from "@/controllers/institution/institution.create.controller";
import { getAllInstitutions } from "@/controllers/institution/institution.get.controller";
import { getHelpeesByInstitutionId } from "@/controllers/institution/institution.list.controller";
import { getSelectInstitutions } from "@/controllers/institution/institution.select.controller";

const institutionRouter = Router();

institutionRouter.post("/", createInstitution);
institutionRouter.get("/location", getAllInstitutions);
institutionRouter.get("/select", getSelectInstitutions);

institutionRouter.get("/:institutionId", getHelpeesByInstitutionId);

export default institutionRouter;
