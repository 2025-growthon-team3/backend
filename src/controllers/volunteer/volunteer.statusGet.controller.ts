// src/controllers/volunteer/volunteer.requested.controller.ts
import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { VolunteerApplicationEntity } from "@/entity/VounteerApplicationEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";
import { toGetApplicationByHelperDto } from "@/utils/volunteer/toGetApplicationByHelperDto";

export const getVolunteerApplicationsByStatus = async (
  status: "requested" | "approved" | "rejected",
  successMessage: string,
  errorMessage: string,
  res: Response
) => {
  try {
    const volunteerRepo = AppDataSource.getRepository(
      VolunteerApplicationEntity
    );

    const requestedApplications = await volunteerRepo.find({
      where: { status },
      relations: ["helpee"], // 필요 시 헬퍼와 헬피 정보 함께 불러옴
      order: { createdAt: "DESC" },
    });
    const data = await Promise.all(
      requestedApplications.map((app) => toGetApplicationByHelperDto(app))
    );

    sendSuccess(res, successMessage, data);
  } catch (err) {
    console.error("봉사 신청 조회 오류:", err);
    sendError(res, errorMessage, err);
  }
};
