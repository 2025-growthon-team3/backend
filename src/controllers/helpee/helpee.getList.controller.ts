/**
 * @swagger
 * /helpee/list:
 *   get:
 *     summary: 기관 소속 헬피 목록 조회
 *     description: 기관 이름을 기준으로 해당 기관에 소속된 헬피 목록을 조회합니다.
 *     tags:
 *       - Helpee
 *     parameters:
 *       - name: institutionName
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: 기관 이름
 *     responses:
 *       200:
 *         description: 기관 소속 헬피 목록 조회 성공
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
 *                   example: 기관 소속 헬피 목록 조회 성공
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       name:
 *                         type: string
 *                       age:
 *                         type: number
 *                       gender:
 *                         type: string
 *                       birthDate:
 *                         type: string
 *                       institution:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                           name:
 *                             type: string
 *       400:
 *         description: 기관명이 누락됨
 *       404:
 *         description: 해당 기관을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { HelpeeEntity } from "@/entity/HelpeeEntity";
import { InstitutionEntity } from "@/entity/InstitutionEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";

export const getHelpeesByInstitutionName = async (req: Request, res: Response) => {
  const { institutionName } = req.query as { institutionName: string };

  if (!institutionName) {
    sendError(res, "기관명을 입력해주세요.", null, 400);
    return;
  }

  try {
    const institution = await AppDataSource.getRepository(InstitutionEntity).findOne({
      where: { name: institutionName },
    });

    if (!institution) {
      sendError(res, "해당 기관을 찾을 수 없습니다.", { institutionName }, 404);
      return;
    }

    const helpees = await AppDataSource.getRepository(HelpeeEntity).find({
      where: { institution: { id: institution.id } },
      relations: ["institution"],
      order: { createdAt: "DESC" },
    });

    sendSuccess(res, "기관 소속 헬피 목록 조회 성공", helpees);
  } catch (err) {
    console.error("헬피 목록 조회 실패:", err);
    sendError(res, "헬피 목록 조회 중 오류 발생", err);
  }
};
