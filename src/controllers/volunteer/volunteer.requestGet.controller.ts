/**
 * @swagger
 * /volunteer/requested:
 *   get:
 *     summary: 요청 상태 봉사 목록 조회
 *     description: 'requested' 상태의 봉사 신청 목록을 반환합니다.
 *     tags:
 *       - Volunteer
 *     responses:
 *       200:
 *         description: 신청 상태 봉사 목록 조회 성공
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
 *                   example: 신청 상태의 봉사 목록 조회 성공
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 1
 *                       status:
 *                         type: string
 *                         example: requested
 *                       helpee:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                             example: 5
 *                           name:
 *                             type: string
 *                             example: 김영희
 *       500:
 *         description: 서버 오류로 인한 조회 실패
 */

import { Request, Response } from "express";
import { getVolunteerApplicationsByStatus } from "./volunteer.statusGet.controller";

export const getRequestedVolunteerApplications = async (
  req: Request,
  res: Response
) => {
  getVolunteerApplicationsByStatus(
    "requested",
    "신청 상태의 봉사 목록 조회 성공",
    "봉사 신청 조회 중 오류 발생",
    res
  );
};
