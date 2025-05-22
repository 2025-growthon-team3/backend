// src/controllers/volunteer/volunteer.byHelper.controller.ts
import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { VolunteerApplicationEntity } from "@/entity/VounteerApplicationEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";
import { toGetApplicationByHelperDto } from "@/utils/volunteer/toGetApplicationByHelperDto";

export const getApplicationsByHelper = async (req: Request, res: Response) => {
  const { helperId } = req.params;

  if (!helperId || isNaN(Number(helperId))) {
    sendError(res, "유효한 helperId를 제공해주세요.", null, 400);
    return;
  }

  try {
    const repo = AppDataSource.getRepository(VolunteerApplicationEntity);

    const applications = await repo.find({
      where: {
        helper: { id: Number(helperId) },
      },
      relations: ["helpee"],
      order: { createdAt: "DESC" },
    });

    const data = await Promise.all(
      applications.map((app) => toGetApplicationByHelperDto(app))
    );

    sendSuccess(res, "봉사 신청 목록 조회 성공", data);
  } catch (err) {
    console.error("봉사 신청 조회 실패:", err);
    sendError(res, "봉사 신청 목록 조회 중 오류 발생", err);
  }
};
