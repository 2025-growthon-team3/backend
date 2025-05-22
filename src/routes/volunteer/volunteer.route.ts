import { Router } from "express";
import { createVolunteerApplication } from "@/controllers/volunteer/volunteer.match.controller";
import { getRequestedVolunteerApplications } from "@/controllers/volunteer/volunteer.requestGet.controller";
import { updateVolunteerStatus } from "@/controllers/volunteer/volunteer.status.controller";
import { getApplicationsByUserId } from "@/controllers/volunteer/volunteer.getListByUser.controller";
import { getApprovedVolunteerApplications } from "@/controllers/volunteer/volunteer.approveGet.controller";
import { volunteerRegisterHistory } from "@/controllers/volunteer/volunteer.register.history.controller";
import { getVolunteerHistories } from "@/controllers/volunteer/volunteer.history.controller";
import { getAllVolunteerHistoryByUserId } from "@/controllers/volunteer/volunteer.history.detail.controller";

const volunteerRouter = Router();

volunteerRouter.get("/approved", getApprovedVolunteerApplications);
volunteerRouter.get("/history", getVolunteerHistories);
volunteerRouter.post("/", createVolunteerApplication);
volunteerRouter.get("/requested", getRequestedVolunteerApplications);
volunteerRouter.post("/history/:applicationId", volunteerRegisterHistory);

volunteerRouter.patch("/:volunteerId", updateVolunteerStatus);
volunteerRouter.get("/:userId", getApplicationsByUserId);
volunteerRouter.get("/history/:userId", getAllVolunteerHistoryByUserId);

export default volunteerRouter;
