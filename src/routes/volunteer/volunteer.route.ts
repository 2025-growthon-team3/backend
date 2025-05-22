import { Router } from "express";
import { createVolunteerApplication } from "@/controllers/volunteer/volunteer.match.controller";
import { getRequestedVolunteerApplications } from "@/controllers/volunteer/volunteer.requestGet.controller";
import { updateVolunteerStatus } from "@/controllers/volunteer/volunteer.status.controller";
import { getApplicationsByUserId } from "@/controllers/volunteer/volunteer.getListByUser.controller";
import { getApprovedVolunteerApplications } from "@/controllers/volunteer/volunteer.approveGet.controller";
import { volunteerRegisterHistory } from "@/controllers/volunteer/volunteer.register.history.controller";
import { getVolunteerHistories } from "@/controllers/volunteer/volunteer.history.controller";
import { getAllVolunteerHistoryByUserId } from "@/controllers/volunteer/volunteer.history.detail.controller";
import { verifyToken } from "@/middleware/verifyToken";

const volunteerRouter = Router();

volunteerRouter.get("/approved", getApprovedVolunteerApplications);
volunteerRouter.get("/history/all", getVolunteerHistories);
volunteerRouter.post("/:helpeeId", verifyToken, createVolunteerApplication);
volunteerRouter.get("/requested", getRequestedVolunteerApplications);
volunteerRouter.get("/", verifyToken, getApplicationsByUserId);
volunteerRouter.get(
  "/history",
  verifyToken,
  getAllVolunteerHistoryByUserId
);



volunteerRouter.patch("/:volunteerId", updateVolunteerStatus);
volunteerRouter.post("/history/:applicationId", volunteerRegisterHistory);

export default volunteerRouter;
