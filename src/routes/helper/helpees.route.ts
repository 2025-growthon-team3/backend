// routes/helpees.ts
import express from "express";
import {
  getUnmatchedHelpees,
  createHelpee,
} from "../../controllers/helpee.controller";

const helpeesRouter = express.Router();

helpeesRouter.get("/", getUnmatchedHelpees);
helpeesRouter.post("/", createHelpee);

export default helpeesRouter;
