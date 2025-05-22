/**
 * @swagger
 * /volunteer/history/{applicationId}:
 *   post:
 *     summary: 봉사 활동 완료 등록
 *     description: 승인된 봉사 신청을 완료 처리하고, 봉사 히스토리에 기록합니다.
 *     tags:
 *       - Volunteer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: applicationId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: 완료 처리할 봉사 신청 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - helpTime
 *             properties:
 *               helpTime:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-01"
 *                 description: 봉사 수행 날짜 (yyyy-mm-dd)
 *     responses:
 *       200:
 *         description: 봉사 완료 등록 성공
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
 *                   example: 봉사 등록이 완료되었습니다.
 *                 data:
 *                   type: object
 *                   properties:
 *                     history:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: number
 *                         helpTime:
 *                           type: string
 *                           format: date
 *                         helpee:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: number
 *                             name:
 *                               type: string
 *                         helper:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: number
 *       400:
 *         description: 잘못된 신청 ID 또는 날짜 형식 오류
 *       404:
 *         description: 신청 내역을 찾을 수 없음 또는 승인되지 않음
 *       500:
 *         description: 서버 내부 오류
 */

import { VolunteerApplicationEntity } from "@/entity/VounteerApplicationEntity";
import { VolunteerHistoryEntity } from "@/entity/VolunteerHistoryEntity";
import { sendError, sendSuccess } from "@/common/utils/responseHelper";
import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { parseISO, isValid } from "date-fns";

export const volunteerRegisterHistory = async (req: Request, res: Response) => {
  const { helpTime } = req.body;
  const applicationId = Number(req.params.applicationId);

  if (isNaN(applicationId)) {
    sendError(res, "올바른 신청 ID가 아닙니다.");
    return;
  }

  // 날짜 형식 유효성 검사
  const parsedDate = parseISO(helpTime);
  if (!isValid(parsedDate)) {
    sendError(res, "날짜 형식이 올바르지 않습니다. (예: 2025-06-01)");
    return;
  }

  const app = await AppDataSource.getRepository(
    VolunteerApplicationEntity
  ).findOne({
    where: { id: applicationId },
    relations: ["helper", "helpee"],
  });

  if (!app || app.status !== "approved") {
    sendError(res, "유효하지 않은 승인된 신청입니다.");
    return;
  }

  app.isCompleted = true;
  await AppDataSource.getRepository(VolunteerApplicationEntity).save(app);

  const history = AppDataSource.getRepository(VolunteerHistoryEntity).create({
    helper: app.helper,
    helpee: app.helpee,
    helpTime: parsedDate, // DATE형으로 저장
  });

  await AppDataSource.getRepository(VolunteerHistoryEntity).save(history);

  sendSuccess(res, "봉사 등록이 완료되었습니다.", { history });
};
