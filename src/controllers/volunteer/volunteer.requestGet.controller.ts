// src/controllers/volunteer/volunteer.requested.controller.ts
import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { VolunteerApplicationEntity } from "@/entity/VounteerApplicationEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";
import { getVolunteerApplicationsByStatus } from "./volunteer.statusGet.controller";

export const getRequestedVolunteerApplications = async (
  req: Request,
  res: Response
) => {
  getVolunteerApplicationsByStatus(
    "requested",
    "신청 상태의 봉사 목록 조회 성공",
    "봉사 신청 조회 중 오류 발생",
    res
  );
};
