/**
 * @swagger
 * /volunteer:
 *   get:
 *     summary: 헬퍼의 봉사 신청 목록 조회
 *     description: JWT 토큰을 통해 로그인한 유저의 userId로 연결된 헬퍼가 신청한 모든 봉사 목록을 반환합니다.
 *     tags:
 *       - Volunteer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 봉사 신청 목록 조회 성공
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
 *                   example: 봉사 신청 목록 조회 성공
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       status:
 *                         type: string
 *                         enum: [requested, approved, rejected]
 *                       isCompleted:
 *                         type: boolean
 *                       helpee:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                           name:
 *                             type: string
 *       401:
 *         description: 인증 실패 (토큰 없음 또는 유효하지 않음)
 *       404:
 *         description: 해당 유저에 연결된 헬퍼 없음
 *       500:
 *         description: 서버 오류
 */

import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { VolunteerApplicationEntity } from "@/entity/VounteerApplicationEntity";
import { HelperEntity } from "@/entity/HelperEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";
import { toGetApplicationByHelperDto } from "@/utils/volunteer/toGetApplicationByHelperDto";

export const getApplicationsByUserId = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    // 1. userId로 연결된 HelperEntity 찾기
    const helper = await AppDataSource.getRepository(HelperEntity).findOne({
      where: { user: { id: Number(userId) } },
    });

    if (!helper) {
      sendError(res, "해당 userId에 연결된 헬퍼를 찾을 수 없습니다.", null, 404);
      return;
    }

    // 2. 해당 헬퍼의 신청 목록 조회
    const applications = await AppDataSource.getRepository(VolunteerApplicationEntity).find({
      where: { helper: { id: helper.id } },
      relations: ["helpee"],
      order: { createdAt: "DESC" },
    });

    const data = await Promise.all(applications.map(toGetApplicationByHelperDto));
    sendSuccess(res, "봉사 신청 목록 조회 성공", data);
  } catch (err) {
    console.error("봉사 신청 조회 실패:", err);
    sendError(res, "봉사 신청 목록 조회 중 오류 발생", err);
  }
};
