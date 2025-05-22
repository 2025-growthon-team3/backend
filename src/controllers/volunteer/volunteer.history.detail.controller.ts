// src/controllers/volunteer/volunteer.getFullHistory.controller.ts
import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { HelperEntity } from "@/entity/HelperEntity";
import { VolunteerHistoryEntity } from "@/entity/VolunteerHistoryEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";
import { toVolunteerHistoryDto } from "@/utils/volunteer/toVolunteerHistoryDto";

export const getAllVolunteerHistoryByUserId = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.params;

  if (!userId || isNaN(Number(userId))) {
    sendError(res, "유효한 userId를 입력해주세요.", null, 400);
    return;
  }

  try {
    // 1. 해당 유저와 연결된 헬퍼 조회
    const helper = await AppDataSource.getRepository(HelperEntity).findOne({
      where: { user: { id: Number(userId) } },
    });

    if (!helper) {
      sendError(res, "해당 유저에 연결된 헬퍼가 없습니다.", null, 404);
      return;
    }

    // 2. 헬퍼 기준 봉사 내역 조회
    const histories = await AppDataSource.getRepository(
      VolunteerHistoryEntity
    ).find({
      where: { helper: { id: helper.id } },
      relations: ["helpee"],
      order: { helpTime: "DESC" },
    });
    const dtoHistories = await Promise.all(
      histories.map((history) => toVolunteerHistoryDto(history))
    );
    sendSuccess(res, "봉사 전체 내역 조회 성공", dtoHistories);
  } catch (err) {
    console.error("봉사 내역 조회 실패:", err);
    sendError(res, "서버 오류로 봉사 내역을 가져오지 못했습니다.", err);
  }
};
