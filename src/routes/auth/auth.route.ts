import { Router } from "express";
import { kakaoLogin } from "../../controllers/auth/auth.login.controller";

const authRouter = Router();

authRouter.get("/login", kakaoLogin);

export default authRouter;

//함수경로지정
