/**
 * @swagger
 * /helper/register/{helperId}:
 *   patch:
 *     summary: 헬퍼 인증 처리
 *     description: 관리자 또는 시스템이 헬퍼의 인증 상태를 true로 변경합니다.
 *     tags:
 *       - Helper
 *     parameters:
 *       - name: helperId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: 인증할 헬퍼의 ID
 *     responses:
 *       200:
 *         description: 헬퍼 인증 완료
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
 *                   example: 헬퍼 인증 완료
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 12
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: 잘못된 helperId
 *       404:
 *         description: 해당 헬퍼를 찾을 수 없음
 *       500:
 *         description: 서버 내부 오류
 */

import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { HelperEntity } from "@/entity/HelperEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";

export const verifyHelper = async (req: Request, res: Response) => {
  const { helperId } = req.params;

  if (!helperId || isNaN(Number(helperId))) {
    sendError(res, "유효한 helperId를 입력해주세요.", null, 400);
    return;
  }

  try {
    const helperRepo = AppDataSource.getRepository(HelperEntity);
    const helper = await helperRepo.findOne({ where: { id: Number(helperId) } });

    if (!helper) {
      sendError(res, "해당 헬퍼를 찾을 수 없습니다.", { helperId }, 404);
      return;
    }

    helper.isVerified = true;
    await helperRepo.save(helper);

    sendSuccess(res, "헬퍼 인증 완료", { id: helper.id, isVerified: true });
  } catch (err) {
    console.error("헬퍼 인증 처리 실패:", err);
    sendError(res, "헬퍼 인증 처리 중 오류 발생", err);
  }
};
