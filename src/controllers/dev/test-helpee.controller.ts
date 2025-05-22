/**
 * @swagger
 * /dev/register/test-helpee:
 *   post:
 *     summary: 테스트 헬피 등록
 *     description: 개발용 테스트 헬피 데이터를 등록합니다. 존재하지 않으면 임시 기관도 생성됩니다.
 *     tags:
 *       - Dev
 *     responses:
 *       200:
 *         description: 테스트 헬피 등록 성공
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
 *                   example: 테스트 헬피 등록 완료
 *                 data:
 *                   $ref: '#/components/schemas/Helpee'
 *       500:
 *         description: 서버 내부 오류로 인한 등록 실패
 */

import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { HelpeeEntity } from "@/entity/HelpeeEntity";
import { InstitutionEntity } from "@/entity/InstitutionEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";

export const registerTestHelpee = async (req: Request, res: Response) => {
  try {
    const institutionRepo = AppDataSource.getRepository(InstitutionEntity);
    const helpeeRepo = AppDataSource.getRepository(HelpeeEntity);

    // 임시 기관 생성 또는 존재 확인
    let institution = await institutionRepo.findOneBy({ name: "테스트 복지관" });
    if (!institution) {
      institution = institutionRepo.create({
        name: "테스트 복지관",
        institutionOwner: "관리자",
        address: "서울특별시 종로구 사직로9길 23",
        phoneNumber: "010-1234-5678",
        latitude: 37.56,
        longitude: 126.97,
      });
      await institutionRepo.save(institution);
    }

    const helpee = helpeeRepo.create({
      name: `테스트 헬피${Math.floor(Math.random() * 100)}`,
      age: 75,
      birthDate: "1950-01-01",
      gender: "female",
      helpRequestDetail: "말벗 필요",
      helpDetail: "주 1회 30분 대화",
      institution,
    });
    await helpeeRepo.save(helpee);

    sendSuccess(res, "테스트 헬피 등록 완료", helpee);
  } catch (err) {
    console.error("테스트 헬피 등록 오류:", err);
    sendError(res, "테스트 헬피 등록 실패", err);
  }
};

