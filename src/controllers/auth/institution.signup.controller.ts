/**
 * @swagger
 * /auth/signup/institution:
 *   patch:
 *     summary: 기관 회원가입
 *     description: 카카오 로그인 후 유저를 기관 사용자로 등록하고 JWT 토큰을 발급합니다.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - kakaoId
 *               - institutionName
 *             properties:
 *               kakaoId:
 *                 type: string
 *                 example: "987654321"
 *               institutionName:
 *                 type: string
 *                 example: "행복복지센터"
 *     responses:
 *       200:
 *         description: 기관 회원가입 성공 및 JWT 토큰 반환
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
 *                   example: 기관 회원가입 성공
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: kakaoId 또는 institutionName 누락
 *       404:
 *         description: 유저 또는 기관 없음
 *       500:
 *         description: 서버 내부 오류
 */


import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { UserEntity } from "@/entity/UserEntity";
import { InstitutionEntity } from "@/entity/InstitutionEntity";
import { InstitutionUserEntity } from "@/entity/InstitutionUserEntity";
import jwt from "jsonwebtoken";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";

export const registerInstitutionUser = async (req: Request, res: Response) => {
  const { kakaoId, institutionName } = req.body;

  if (!kakaoId || !institutionName) {
    sendError(res, "kakaoId와 institutionName은 필수입니다.", null, 400);
  }

  try {
    const userRepo = AppDataSource.getRepository(UserEntity);
    const institutionRepo = AppDataSource.getRepository(InstitutionEntity);
    const institutionUserRepo = AppDataSource.getRepository(
      InstitutionUserEntity
    );

    // 1. 기관 존재 확인
    const institution = await institutionRepo.findOneBy({
      name: institutionName,
    });
    if (!institution) {
      sendError(res, "해당 기관을 찾을 수 없습니다.", { institutionName }, 404);
      return;
    }

    // 2. 유저 존재 확인
    const user = await userRepo.findOneBy({ kakaoId });
    if (!user) {
      sendError(res, "해당 사용자를 찾을 수 없습니다.", { kakaoId }, 404);
      return;
    }

    // 3. 사용자 정보 업데이트
    user.role = "institution";
    user.isFirstLogin = false;
    user.latitude = institution.latitude;
    user.longitude = institution.longitude;
    await userRepo.save(user);

    // 4. 기관 사용자 생성
    const institutionUser = institutionUserRepo.create({
      user: { id: user.id },
      institution,
    });

    await institutionUserRepo.save(institutionUser);

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

    sendSuccess(res, "기관 회원가입 성공", {
      accessToken: token,
    });
  } catch (err) {
    console.error("기관 회원가입 실패:", err);
    sendError(res, "기관 회원가입 중 오류 발생", err);
  }
};
