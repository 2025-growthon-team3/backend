import express from "express";
import { getUnmatchedHelpees } from "@/controllers/helpee/helpee.controller";
import { createHelpee } from "@/controllers/helpee/helpee.create.controller";
import { getHelpeeById } from "@/controllers/helpee/helpee.detail.controller";
import { deleteHelpeeById } from "@/controllers/helpee/helpee.delete.controller";
import { getNearbyInstitutionHelpees } from "@/controllers/helpee/helpee.getNearby.controller";
import { getHelpeesByInstitutionName } from "@/controllers/helpee/helpee.getList.controller";
import { verifyToken } from "@/middleware/verifyToken";

const helpeeRouter = express.Router();

helpeeRouter.get("/", getUnmatchedHelpees);
helpeeRouter.post("/register", verifyToken, createHelpee);

// ✅ 고정 path 먼저
helpeeRouter.get("/nearby", verifyToken, getNearbyInstitutionHelpees);
helpeeRouter.get("/list", getHelpeesByInstitutionName);

// ✅ 나중에 동적 path
helpeeRouter.get("/:id", getHelpeeById);
helpeeRouter.delete("/:id", verifyToken, deleteHelpeeById);

export default helpeeRouter;
