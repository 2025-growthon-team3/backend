import { Router } from "express";
import { generateTestAccessToken } from "@/controllers/dev/test-user.controller";
import { registerTestHelpee } from "@/controllers/dev/test-helpee.controller";
import { registerTestHelper } from "@/controllers/dev/test-helper.controller";

const devRouter = Router();

devRouter.get("/:userId", generateTestAccessToken);
devRouter.post("/helpee", registerTestHelpee);
devRouter.post("/helper", registerTestHelper);

export default devRouter;
