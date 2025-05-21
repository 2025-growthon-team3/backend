// routes/helpees.ts
import express from "express";
import { getUnmatchedHelpees } from "../../controllers/helpee.controller";
import { createHelpee } from "@/controllers/helpee/helpee.create.controller";
const helpeeRouter = express.Router();

helpeeRouter.get("/", getUnmatchedHelpees);
helpeeRouter.post("/register", createHelpee);

export default helpeeRouter;
