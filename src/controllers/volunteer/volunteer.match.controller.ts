/**
 * @swagger
 * /volunteer/{helpeeId}:
 *   post:
 *     summary: 봉사 신청
 *     description: 헬퍼 권한을 가진 사용자가 헬피에게 봉사를 신청합니다. 중복 신청은 허용되지 않습니다.
 *     tags:
 *       - Volunteer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: helpeeId
 *         in: path
 *         required: true
 *         description: 봉사를 신청할 헬피의 ID
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: 봉사 신청 성공
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
 *                   example: 봉사 신청 성공
 *                 data:
 *                   type: object
 *                   properties:
 *                     helpeeId:
 *                       type: number
 *                       example: 3
 *       400:
 *         description: 잘못된 요청 (파라미터 누락 등)
 *       401:
 *         description: 인증 실패 또는 권한 없음
 *       404:
 *         description: 헬피 또는 헬퍼 정보 없음
 *       409:
 *         description: 중복 신청
 *       500:
 *         description: 서버 오류
 */

import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { VolunteerApplicationEntity } from "@/entity/VounteerApplicationEntity";
import { HelperEntity } from "@/entity/HelperEntity";
import { HelpeeEntity } from "@/entity/HelpeeEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";

export const createVolunteerApplication = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId || isNaN(Number(userId))) {
      sendError(res, "토큰이 없거나 userId가 유효하지 않습니다.", null, 401);
      return;
    }

    const { helpeeId } = req.params;
    if (!helpeeId) {
      sendError(res, "helpeeId는 필수입니다.", "InvalidRequestBody");
      return;
    }

    // 1. userId로 헬퍼 조회
    const helperRepo = AppDataSource.getRepository(HelperEntity);
    const helper = await helperRepo.findOne({
      where: { user: { id: Number(userId) } },
    });

    if (!helper) {
      sendError(res, "해당 userId로 연결된 헬퍼가 없습니다.", "HelperNotFound");
      return;
    }

    // 2. 헬피 조회
    const helpee = await AppDataSource.getRepository(HelpeeEntity).findOne({
      where: { id: Number(helpeeId) },
    });

    if (!helpee) {
      sendError(res, "해당 helpee를 찾을 수 없습니다.", "HelpeeNotFound");
      return;
    }

    // 3. 중복 신청 체크
    const volunteerAppRepo = AppDataSource.getRepository(
      VolunteerApplicationEntity
    );
    const exists = await volunteerAppRepo.findOne({
      where: { helper: { id: helper.id }, helpee: { id: helpee.id } },
    });

    if (exists) {
      sendError(res, "이미 신청된 봉사입니다.", "DuplicateApplication");
      return;
    }

    // 4. 신청 저장
    const newApplication = volunteerAppRepo.create({
      helper,
      helpee,
      status: "requested",
    });

    await volunteerAppRepo.save(newApplication);

    sendSuccess(
      res,
      "봉사 신청 성공",
      {
        helpeeId: helpee.id,
      },
      201
    );
  } catch (err) {
    console.error("봉사 신청 중 오류:", err);
    sendError(res, "봉사 신청 중 오류 발생", err);
  }
};
