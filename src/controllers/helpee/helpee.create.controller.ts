/**
 * @swagger
 * /helpee:
 *   post:
 *     summary: 헬피 등록
 *     description: 기관 권한을 가진 사용자가 헬피(도움 대상자)를 등록합니다.
 *     tags:
 *       - Helpee
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *               - birth
 *               - gender
 *               - institutionName
 *               - helpRequest
 *             properties:
 *               name:
 *                 type: string
 *                 example: "김철수"
 *               age:
 *                 type: number
 *                 example: 78
 *               birth:
 *                 type: string
 *                 example: "451212"  # YYMMDD 형식
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *                 example: "male"
 *               institutionName:
 *                 type: string
 *                 example: "행복복지센터"
 *               helpRequest:
 *                 type: string
 *                 example: "장보기 지원이 필요합니다"
 *               helpDetail:
 *                 type: string
 *                 example: "주 1회, 인근 마트에서 장보기 동행"
 *     responses:
 *       200:
 *         description: 헬피 등록 성공
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
 *                   example: 헬피 등록 성공
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     name:
 *                       type: string
 *                     age:
 *                       type: number
 *                     gender:
 *                       type: string
 *                     birthDate:
 *                       type: string
 *                     institution:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: number
 *                         name:
 *                           type: string
 *       401:
 *         description: 기관 권한 없음
 *       404:
 *         description: 기관을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { HelpeeEntity } from "@/entity/HelpeeEntity";
import { InstitutionEntity } from "@/entity/InstitutionEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";

export const createHelpee = async (req: Request, res: Response) => {
  const { name, age, birth, gender, institutionName, helpRequest, helpDetail } =
    req.body;
  if (req.role !== "institution") {
    sendError(res, "기관 권한이 없습니다.", null, 401);
    return;
  }

  try {
    const institutionRepo = AppDataSource.getRepository(InstitutionEntity);
    const helpeeRepo = AppDataSource.getRepository(HelpeeEntity);

    // 1. 기관 이름으로 institution 조회
    const institution = await institutionRepo.findOneBy({
      name: institutionName,
    });
    if (!institution) {
      sendError(res, "해당 기관을 찾을 수 없습니다", { institutionName });
      return;
    }

    // 2. 생년월일 문자열 포맷 보정
    let birthDate: string | undefined = undefined;
    if (birth) {
      const formatted = birth.toString().padStart(6, "0"); // 예: 051212 → '051212'
      birthDate = `20${formatted.slice(0, 2)}-${formatted.slice(
        2,
        4
      )}-${formatted.slice(4, 6)}`;
    }

    // 3. Helpee 생성 및 저장
    const newHelpee = helpeeRepo.create({
      name,
      age,
      birthDate,
      gender,
      helpRequestDetail: helpRequest,
      helpDetail,
      institution,
    });

    await helpeeRepo.save(newHelpee);
    sendSuccess(res, "헬피 등록 성공", newHelpee);
  } catch (err) {
    console.error("헬피 등록 오류:", err);
    sendError(res, "헬피 등록 중 오류 발생", err);
  }
};
