import { Router } from "express";
import { kakaoLogin } from "@/controllers/auth/auth.login.controller";
import { registerInstitutionUser } from "@/controllers/auth/institution.signup.controller";
import { createHelper } from "@/controllers/auth/helper.signup.controller";
import { testLogin } from "@/controllers/auth/test.login.controller";

const authRouter = Router();

authRouter.get("/login", kakaoLogin);
authRouter.patch("/signup/institution", registerInstitutionUser);
authRouter.patch("/signup/helper", createHelper);
authRouter.get("/test/:userId", testLogin);
export default authRouter;

//함수경로지정
