import { Router } from "express";
import { kakaoLogin } from "../../controllers/auth/auth.controller";

const authRouter = Router();

authRouter.get("/login", kakaoLogin);

export default authRouter;
