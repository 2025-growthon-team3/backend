// src/controllers/volunteer/volunteer.history.controller.ts
import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { VolunteerHistoryEntity } from "@/entity/VolunteerHistoryEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";

export const getVolunteerHistories = async (req: Request, res: Response) => {
  try {
    const historyRepo = AppDataSource.getRepository(VolunteerHistoryEntity);

    const histories = await historyRepo.find({
      relations: ["helpee"],
      order: {
        helpTime: "DESC",
      },
    });

    sendSuccess(res, "봉사 내역 조회 성공", histories);
  } catch (err) {
    console.error("봉사 내역 조회 실패:", err);
    sendError(res, "봉사 내역 조회 중 오류 발생", err);
  }
};
