// routes/auth/temp-token.route.ts
import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "@/data-source";
import { UserEntity } from "@/entity/UserEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";
import { toUserResponseDto } from "@/utils/auth/toUserResponseDTO";

// 임시 토큰 발급 (테스트용)
export const testLogin = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10);

  try {
    const userRepo = AppDataSource.getRepository(UserEntity);
    const user = await userRepo.findOneBy({ id: userId });

    if (!user) {
      sendError(res, "해당 사용자를 찾을 수 없습니다");
      return;
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    const safeUser = await toUserResponseDto(user);
    sendSuccess(res, "임시 토큰 발급 성공", { accessToken: token, user: safeUser });
  } catch (error) {
    console.error("임시 토큰 발급 오류:", error);
    sendError(res, "임시 토큰 발급 실패", error);
  }
};
