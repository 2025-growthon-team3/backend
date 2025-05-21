import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { InstitutionEntity } from "@/entity/InstitutionEntity";
import { toInstitutionLocationDto } from "@/utils/institution/toInstitutionLocationDto";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";

export const getAllInstitutions = async (req: Request, res: Response) => {
  try {
    const institutionRepo = AppDataSource.getRepository(InstitutionEntity);
    const institutions = await institutionRepo.find();

    const dtoList = await Promise.all(
      institutions.map((institution) => toInstitutionLocationDto(institution))
    );

    sendSuccess(res, "기관 목록 조회 성공", dtoList);
  } catch (error) {
    console.error("기관 목록 조회 실패:", error);
    sendError(res, "기관 목록 조회 중 오류 발생", error);
  }
};
