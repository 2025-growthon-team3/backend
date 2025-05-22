/**
 * @swagger
 * /volunteer/history:
 *   get:
 *     summary: 로그인한 사용자의 봉사 내역 조회
 *     description: 토큰에 포함된 userId를 기반으로 해당 사용자의 전체 봉사 내역을 최신순으로 조회합니다.
 *     tags:
 *       - Volunteer
 *     security:
 *       - bearerAuth: []
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
 *                   example: 봉사 전체 내역 조회 성공
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       helpTime:
 *                         type: string
 *                         format: date
 *                         example: "2025-06-01"
 *                       helpee:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "김영희"
 *                           helpDetail:
 *                             type: string
 *                             example: "방 청소와 창문 닦기"
 *       401:
 *         description: 인증되지 않은 사용자
 *       404:
 *         description: 해당 유저와 연결된 헬퍼 없음
 *       500:
 *         description: 서버 오류
 */

import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { HelperEntity } from "@/entity/HelperEntity";
import { VolunteerHistoryEntity } from "@/entity/VolunteerHistoryEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";
import { toVolunteerHistoryDto } from "@/utils/volunteer/toVolunteerHistoryDto";

export const getAllVolunteerHistoryByUserId = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId;

  try {
    // 1. 해당 유저와 연결된 헬퍼 조회
    const helper = await AppDataSource.getRepository(HelperEntity).findOne({
      where: { user: { id: Number(userId) } },
    });

    if (!helper) {
      sendError(res, "해당 유저에 연결된 헬퍼가 없습니다.", null, 404);
      return;
    }

    // 2. 헬퍼 기준 봉사 내역 조회
    const histories = await AppDataSource.getRepository(
      VolunteerHistoryEntity
    ).find({
      where: { helper: { id: helper.id } },
      relations: ["helpee"],
      order: { helpTime: "DESC" },
    });
    const dtoHistories = await Promise.all(
      histories.map((history) => toVolunteerHistoryDto(history))
    );
    sendSuccess(res, "봉사 전체 내역 조회 성공", dtoHistories);
  } catch (err) {
    console.error("봉사 내역 조회 실패:", err);
    sendError(res, "서버 오류로 봉사 내역을 가져오지 못했습니다.", err);
  }
};
