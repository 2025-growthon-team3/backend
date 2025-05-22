// src/controllers/volunteer/volunteer.byUser.controller.ts
import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { VolunteerApplicationEntity } from "@/entity/VounteerApplicationEntity";
import { HelperEntity } from "@/entity/HelperEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";
import { toGetApplicationByHelperDto } from "@/utils/volunteer/toGetApplicationByHelperDto";

export const getApplicationsByUserId = async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId || isNaN(Number(userId))) {
    sendError(res, "유효한 userId를 제공해주세요.", null, 400);
    return;
  }

  try {
    // 1. userId로 연결된 HelperEntity 찾기
    const helper = await AppDataSource.getRepository(HelperEntity).findOne({
      where: { user: { id: Number(userId) } },
    });

    if (!helper) {
      sendError(res, "해당 userId에 연결된 헬퍼를 찾을 수 없습니다.", null, 404);
      return;
    }

    // 2. 해당 헬퍼의 신청 목록 조회
    const applications = await AppDataSource.getRepository(VolunteerApplicationEntity).find({
      where: { helper: { id: helper.id } },
      relations: ["helpee"],
      order: { createdAt: "DESC" },
    });

    const data = await Promise.all(applications.map(toGetApplicationByHelperDto));
    sendSuccess(res, "봉사 신청 목록 조회 성공", data);
  } catch (err) {
    console.error("봉사 신청 조회 실패:", err);
    sendError(res, "봉사 신청 목록 조회 중 오류 발생", err);
  }
};
