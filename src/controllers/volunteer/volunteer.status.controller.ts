/**
 * @swagger
 * /volunteer/{volunteerId}:
 *   patch:
 *     summary: 봉사 상태 업데이트
 *     description: 봉사 신청의 상태를 'approved' 또는 'rejected'로 변경합니다.
 *     tags:
 *       - Volunteer
 *     parameters:
 *       - in: path
 *         name: volunteerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 상태를 변경할 봉사 신청의 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *                 example: approved
 *     responses:
 *       200:
 *         description: 상태 업데이트 성공
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
 *                   example: 상태가 성공적으로 업데이트되었습니다.
 *                 data:
 *                   $ref: '#/components/schemas/VolunteerApplication'
 *       400:
 *         description: 유효하지 않은 상태 값
 *       404:
 *         description: 봉사 신청 ID가 존재하지 않음
 *       500:
 *         description: 서버 내부 오류
 */

import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { VolunteerApplicationEntity } from "@/entity/VounteerApplicationEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";

export const updateVolunteerStatus = async (req: Request, res: Response) => {
  const { volunteerId } = req.params;
  const { status } = req.body;

  // 허용된 status 값 체크
  const validStatuses = ["approved", "rejected"];
  if (!validStatuses.includes(status)) {
    sendError(res, "유효하지 않은 상태 값입니다.", { status }, 400);
    return;
  }

  try {
    const volunteerRepo = AppDataSource.getRepository(
      VolunteerApplicationEntity
    );
    const application = await volunteerRepo.findOneBy({
      id: Number(volunteerId),
    });

    if (!application) {
      sendError(
        res,
        "해당 봉사 신청을 찾을 수 없습니다.",
        { volunteerId },
        404
      );
      return;
    }

    application.status = status as typeof application.status;
    await volunteerRepo.save(application);

    sendSuccess(res, "상태가 성공적으로 업데이트되었습니다.", application);
  } catch (err) {
    console.error("봉사 상태 업데이트 실패:", err);
    sendError(res, "봉사 상태 업데이트 중 오류 발생", err);
  }
};
