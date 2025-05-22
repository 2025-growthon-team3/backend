import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { InstitutionEntity } from "@/entity/InstitutionEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";

export const getNearbyInstitutionHelpees = async (
  req: Request,
  res: Response
) => {
  const { latitude, longitude } = req.body;

  if (isNaN(latitude) || isNaN(longitude)) {
    sendError(
      res,
      "위도와 경도를 숫자로 정확히 입력해주세요.",
      { latitude, longitude },
      400
    );
    return;
  }

  try {
    const institutionRepo = AppDataSource.getRepository(InstitutionEntity);

    // 1. Haversine 거리 계산으로 2km 이내 기관 찾기
    const institutions = await institutionRepo
      .createQueryBuilder("institution")
      .leftJoinAndSelect("institution.helpees", "helpee")
      .where(
        `
        institution.latitude IS NOT NULL AND
        institution.longitude IS NOT NULL AND
        (
          6371 * acos(
            cos(radians(:lat)) *
            cos(radians(institution.latitude)) *
            cos(radians(institution.longitude) - radians(:lng)) +
            sin(radians(:lat)) *
            sin(radians(institution.latitude))
          )
        ) <= 2
      `,
        {
          lat: latitude,
          lng: longitude,
        }
      )
      .getMany();

    // 2. 각 기관의 헬피들 추출 (헬피가 없는 기관은 제외)
    const helpees = institutions.flatMap((inst) => inst.helpees || []);

    sendSuccess(res, "2km 이내 기관 소속 헬피 목록 조회 성공", helpees);
  } catch (err) {
    console.error("헬피 거리 기반 조회 실패:", err);
    sendError(res, "서버 오류로 헬피 목록을 가져오지 못했습니다.", err);
  }
};
