import { Router } from "express";
import { createVolunteerApplication } from "@/controllers/helper/volunteer.application.controller";
// import { getReviewRequests } from "@/controllers/helper/helper.review-request.controller";
import { verifyToken } from "@/middleware/verifyToken";

const router = Router();

// 심사 신청 조회
//  router.get("/review-requests", verifyToken, getReviewRequests);

// 봉사 신청 생성
router.post("/volunteer-applications", verifyToken, createVolunteerApplication);

export default router;