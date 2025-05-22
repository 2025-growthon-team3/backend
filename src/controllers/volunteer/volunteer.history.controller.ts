/**
 * @swagger
 * /volunteer/history/all:
 *   get:
 *     summary: 전체 봉사 내역 조회
 *     description: 전체 봉사 완료 내역을 최신 순으로 조회합니다. 헬피 정보도 함께 포함됩니다.
 *     tags:
 *       - Volunteer
 *     responses:
 *       200:
 *         description: 봉사 내역 조회 성공
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
 *                   example: 봉사 내역 조회 성공
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       helpTime:
 *                         type: string
 *                         format: date
 *                         example: "2025-06-01"
 *                       helpee:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                           name:
 *                             type: string
 *                           helpDetail:
 *                             type: string
 *       500:
 *         description: 서버 오류 발생
 */

import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { VolunteerHistoryEntity } from "@/entity/VolunteerHistoryEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";

export const getVolunteerHistories = async (req: Request, res: Response) => {
  try {
    const historyRepo = AppDataSource.getRepository(VolunteerHistoryEntity);

    const histories = await historyRepo.find({
      relations: ["helpee"],
      order: {
        helpTime: "DESC",
      },
    });

    sendSuccess(res, "봉사 내역 조회 성공", histories);
  } catch (err) {
    console.error("봉사 내역 조회 실패:", err);
    sendError(res, "봉사 내역 조회 중 오류 발생", err);
  }
};
