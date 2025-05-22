/**
 * @swagger
 * /volunteer/approved:
 *   get:
 *     summary: 승인된 봉사 신청 목록 조회
 *     description: 상태가 'approved'인 봉사 신청 목록을 조회합니다.
 *     tags:
 *       - Volunteer
 *     responses:
 *       200:
 *         description: 승인된 봉사 신청 리스트 반환 성공
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
 *                   example: 승인 상태의 봉사 목록 조회 성공
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/VolunteerApplication'
 *       500:
 *         description: 서버 내부 오류
 */
import { getVolunteerApplicationsByStatus } from "./volunteer.statusGet.controller";
import { Request, Response } from "express";

export const getApprovedVolunteerApplications = async (
  req: Request,
  res: Response
) => {
  getVolunteerApplicationsByStatus(
    "approved",
    "승인 상태의 봉사 목록 조회 성공",
    "봉사 신청 조회 중 오류 발생",
    res
  );
};
