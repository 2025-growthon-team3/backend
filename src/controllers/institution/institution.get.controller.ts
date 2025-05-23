/**
 * @swagger
 * /institution/location:
 *   get:
 *     summary: 전체 기관 목록 조회
 *     description: 등록된 모든 기관의 기본 위치 정보(이름, 주소, 위도, 경도 등)를 조회합니다.
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
 *                       address:
 *                         type: string
 *                         example: 서울특별시 강남구 테헤란로 123
 *                       latitude:
 *                         type: number
 *                         example: 37.5665
 *                       longitude:
 *                         type: number
 *                         example: 126.978
 *       500:
 *         description: 서버 오류로 인해 기관 목록 조회 실패
 */

import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { InstitutionEntity } from "@/entity/InstitutionEntity";
import { toInstitutionLocationDto } from "@/utils/institution/toInstitutionLocationDto";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";

export const getAllInstitutions = async (req: Request, res: Response) => {
  try {
    const institutionRepo = AppDataSource.getRepository(InstitutionEntity);
    const institutions = await institutionRepo.find();

    const dtoList = await Promise.all(
      institutions.map((institution) => toInstitutionLocationDto(institution))
    );

    sendSuccess(res, "기관 목록 조회 성공", dtoList);
  } catch (error) {
    console.error("기관 목록 조회 실패:", error);
    sendError(res, "기관 목록 조회 중 오류 발생", error);
  }
};
