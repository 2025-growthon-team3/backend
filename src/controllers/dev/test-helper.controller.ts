/**
 * @swagger
 * /dev/test/helper:
 *   post:
 *     summary: 테스트 헬퍼 등록
 *     description: 개발용 테스트 헬퍼 계정과 헬퍼 정보를 생성합니다.
 *     tags:
 *       - Dev
 *     responses:
 *       200:
 *         description: 테스트 헬퍼 등록 성공
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
 *                   example: 테스트 헬퍼 등록 완료
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: number
 *                       example: 42
 *       500:
 *         description: 서버 내부 오류로 인한 등록 실패
 */

import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { UserEntity } from "@/entity/UserEntity";
import { HelperEntity } from "@/entity/HelperEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";

export const registerTestHelper = async (req: Request, res: Response) => {
  try {
    const userRepo = AppDataSource.getRepository(UserEntity);
    const helperRepo = AppDataSource.getRepository(HelperEntity);

    const user = userRepo.create({
      name: `테스트 헬퍼${Math.floor(Math.random() * 100)}`,
      kakaoId: `test_helper_${Date.now()}`,
      profileImage: "",
      role: "helper",
      isFirstLogin: false,
    });
    await userRepo.save(user);

    const helper = helperRepo.create({
      user,
      residentNumber: "900101-1234567",
      address: "서울특별시 종로구 사직로9길 23",
    });
    await helperRepo.save(helper);

    sendSuccess(res, "테스트 헬퍼 등록 완료", { userId: user.id });
  } catch (err) {
    console.error("테스트 헬퍼 등록 오류:", err);
    sendError(res, "테스트 헬퍼 등록 실패", err);
  }
};
