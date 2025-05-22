import { getVolunteerApplicationsByStatus } from "./volunteer.statusGet.controller";
import { Request, Response } from "express";

export const getApprovedVolunteerApplications = async (
  req: Request,
  res: Response
) => {
  getVolunteerApplicationsByStatus(
    "approved",
    "승인 상태의 봉사 목록 조회 성공",
    "봉사 신청 조회 중 오류 발생",
    res
  );
};
