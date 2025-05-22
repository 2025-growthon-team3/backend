/**
 * @swagger
 * /helpee/{id}:
 *   get:
 *     summary: 헬피 상세 조회
 *     description: 주어진 ID를 기반으로 헬피 상세 정보를 조회합니다.
 *     tags:
 *       - Helpee
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 헬피의 ID
 *     responses:
 *       200:
 *         description: 헬피 상세 조회 성공
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
 *                   example: 헬피 상세 조회 성공
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     name:
 *                       type: string
 *                     age:
 *                       type: number
 *                     birthDate:
 *                       type: string
 *                     gender:
 *                       type: string
 *                     helpRequestDetail:
 *                       type: string
 *                     helpDetail:
 *                       type: string
 *       400:
 *         description: 유효하지 않은 헬피 ID
 *       404:
 *         description: 헬피를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { HelpeeEntity } from "@/entity/HelpeeEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";

export const getHelpeeById = async (req: Request, res: Response) => {
  const helpeeId = Number(req.params.id);

  if (isNaN(helpeeId)) {
    sendError(res, "유효하지 않은 헬피 ID입니다.", { id: req.params.id }, 400);
  }

  try {
    const helpeeRepo = AppDataSource.getRepository(HelpeeEntity);

    const helpee = await helpeeRepo.findOne({
      where: { id: helpeeId },
      //relations: ["institution", "volunteerApplications", "volunteerHistories"], // 필요 시 relations 추가
    });

    if (!helpee) {
      sendError(res, "해당 헬피를 찾을 수 없습니다.", { id: helpeeId }, 404);
    }

    sendSuccess(res, "헬피 상세 조회 성공", helpee);
  } catch (err) {
    console.error("헬피 상세 조회 실패:", err);
    sendError(res, "헬피 상세 조회 중 오류 발생", err);
  }
};
