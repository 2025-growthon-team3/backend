import { Router } from "express";
import { verifyHelper } from "@/controllers/helper/helper.review.controller";


const router = Router();

router.patch("/register/:helperId", verifyHelper);

export default router;
