/**
 * @swagger
 * /helpee/unmatched:
 *   get:
 *     summary: 매칭되지 않은 헬피 목록 조회
 *     description: 매칭 상태가 false이거나 아직 설정되지 않은 헬피들을 조회합니다.
 *     tags:
 *       - Helpee
 *     responses:
 *       200:
 *         description: 매칭되지 않은 헬피 리스트 반환 성공
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
 *                   example: 매칭되지 않은 헬피 리스트 조회 성공
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: 김영희
 *                       isMatched:
 *                         type: boolean
 *                         nullable: true
 *                         example: false
 *                       institution:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: 행복복지센터
 *       500:
 *         description: 서버 오류 발생
 */


import { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { HelpeeEntity } from "../../entity/HelpeeEntity";
import { Raw } from "typeorm";

export const getUnmatchedHelpees = async (req: Request, res: Response) => {
  try {
    const helpeeRepository = AppDataSource.getRepository(HelpeeEntity);

    const unmatchedHelpees = await helpeeRepository.find({
      where: [
        { isMatched: false },
        { isMatched: Raw((alias) => `${alias} IS NULL`) },
      ],
      relations: ["institution"],
      order: { createdAt: "DESC" },
    });

    res.status(200).json({
      success: true,
      message: "매칭되지 않은 헬피 리스트 조회 성공",
      data: unmatchedHelpees,
    });
  } catch (error) {
    console.error("매칭되지 않은 헬피 리스트 조회 실패:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
      error,
    });
  }
};
