/**
 * @swagger
 * /institution/select:
 *   get:
 *     summary: 선택용 기관 목록 조회
 *     description: 셀렉트 박스나 드롭다운에 사용할 수 있는 간단한 기관 목록(ID, 이름 등)을 조회합니다.
 *     tags:
 *       - Institution
 *     responses:
 *       200:
 *         description: 기관 목록 조회 성공
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
 *                   example: 기관 목록 조회 성공
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: 행복복지센터
 *       500:
 *         description: 서버 오류 발생
 */

import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { InstitutionEntity } from "@/entity/InstitutionEntity";
import { toInstitutionSelectDto } from "@/utils/institution/toInstitutionSelectDto";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";

export const getSelectInstitutions = async (req: Request, res: Response) => {
  try {
    const institutionRepo = AppDataSource.getRepository(InstitutionEntity);
    const institutions = await institutionRepo.find();

    const selectDtoList = await toInstitutionSelectDto(institutions);
    sendSuccess(res, "기관 목록 조회 성공", selectDtoList);
  } catch (error) {
    console.error("기관 목록 조회 실패:", error);
    sendError(res, "기관 목록 조회 중 오류 발생", error);
  }
};
