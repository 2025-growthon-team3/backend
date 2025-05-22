/**
 * @swagger
 * /institution/{institutionId}:
 *   get:
 *     summary: 기관 ID로 헬피 목록 조회
 *     description: 기관 ID를 기반으로 해당 기관에 소속된 헬피 목록을 조회합니다.
 *     tags:
 *       - Helpee
 *     parameters:
 *       - name: institutionId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: 기관 ID
 *     responses:
 *       200:
 *         description: 기관 소속 헬피 목록 조회 성공
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
 *                   example: 기관 소속 헬피 목록 조회 성공
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       name:
 *                         type: string
 *                       age:
 *                         type: number
 *                       gender:
 *                         type: string
 *                       birthDate:
 *                         type: string
 *       400:
 *         description: 유효하지 않은 institutionId
 *       404:
 *         description: 해당 기관을 찾을 수 없음
 *       500:
 *         description: 서버 오류 발생
 */

import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { HelpeeEntity } from "@/entity/HelpeeEntity";
import { InstitutionEntity } from "@/entity/InstitutionEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";

export const getHelpeesByInstitutionId = async (
  req: Request,
  res: Response
) => {
  const institutionId = Number(req.params.institutionId);

  // 1. 유효성 검사
  if (isNaN(institutionId)) {
    sendError(res, "유효한 institutionId를 입력해주세요.", null, 400);
    return;
  }

  try {
    // 2. 기관 존재 여부 확인
    const institution = await AppDataSource.getRepository(
      InstitutionEntity
    ).findOneBy({
      id: institutionId,
    });

    if (!institution) {
      sendError(res, "해당 기관을 찾을 수 없습니다.", { institutionId }, 404);
      return;
    }

    // 3. 헬피 목록 조회
    const helpees = await AppDataSource.getRepository(HelpeeEntity).find({
      where: { institution: { id: institution.id } },
      order: { createdAt: "DESC" },
    });

    sendSuccess(res, "기관 소속 헬피 목록 조회 성공", helpees);
  } catch (err) {
    console.error("헬피 목록 조회 실패:", err);
    sendError(res, "헬피 목록 조회 중 오류 발생", err);
  }
};
