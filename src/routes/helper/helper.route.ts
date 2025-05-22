import { Router } from "express";
import { verifyHelper } from "@/controllers/helper/helper.review.controller";
import { verifyToken } from "@/middleware/verifyToken";

const router = Router();

router.patch("/verify/:helperId", verifyHelper);

export default router;
