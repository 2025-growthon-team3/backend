/**
 * @swagger
 * /auth/test/{userId}:
 *   get:
 *     summary: 테스트용 Access Token 발급
 *     description: 테스트를 위해 지정된 userId에 대한 JWT Access Token을 발급합니다.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 액세스 토큰을 발급할 사용자 ID
 *     responses:
 *       200:
 *         description: 액세스 토큰 발급 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 엑세스 토큰 발급 성공
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: 잘못된 userId
 *       404:
 *         description: 해당 유저를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { UserEntity } from "@/entity/UserEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";
import jwt from "jsonwebtoken";

export const generateTestAccessToken = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  if (isNaN(userId)) {
    sendError(res, "유효하지 않은 userId입니다.", null, 400);
    return;
  }

  try {
    const user = await AppDataSource.getRepository(UserEntity).findOneBy({ id: userId });
    if (!user) {
      sendError(res, "해당 유저를 찾을 수 없습니다.", { userId }, 404);
      return;
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    sendSuccess(res, "엑세스 토큰 발급 성공", { accessToken: token });
  } catch (err) {
    console.error("토큰 발급 실패:", err);
    sendError(res, "토큰 발급 중 오류 발생", err);
  }
};
