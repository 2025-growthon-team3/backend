import { Router } from "express";
import { createVolunteerApplication } from "@/controllers/volunteer/volunteer.match.controller";
import { getRequestedVolunteerApplications } from "@/controllers/volunteer/volunteer.requestGet.controller";
import { updateVolunteerStatus } from "@/controllers/volunteer/volunteer.status.controller";
import { getApplicationsByHelper } from "@/controllers/volunteer/volunteer.getListByhelper.controller";
import { getApprovedVolunteerApplications } from "@/controllers/volunteer/volunteer.approveGet.controller";

const volunteerRouter = Router();

volunteerRouter.get("/approved", getApprovedVolunteerApplications);
volunteerRouter.post("/", createVolunteerApplication);
volunteerRouter.get("/requested", getRequestedVolunteerApplications);
volunteerRouter.patch("/:volunteerId", updateVolunteerStatus);
volunteerRouter.get("/:helperId", getApplicationsByHelper);

export default volunteerRouter;
