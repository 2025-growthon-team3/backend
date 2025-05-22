import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { InstitutionEntity } from "@/entity/InstitutionEntity";
import { UserEntity } from "@/entity/UserEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";

export const getNearbyInstitutionHelpees = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId;

  if (!userId || isNaN(Number(userId))) {
    sendError(res, "토큰이 없거나 userId가 유효하지 않습니다.", null, 401);
    return;
  }

  try {
    const user = await AppDataSource.getRepository(UserEntity).findOne({
      where: { id: Number(userId) },
    });

    if (!user || user.latitude == null || user.longitude == null) {
      sendError(res, "사용자의 위치 정보가 없습니다.", null, 400);
      return;
    }

    const { latitude, longitude } = user;

    const institutionRepo = AppDataSource.getRepository(InstitutionEntity);

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

    const helpees = institutions.flatMap((inst) => inst.helpees || []);

    sendSuccess(res, "2km 이내 기관 소속 헬피 목록 조회 성공", helpees);
  } catch (err) {
    console.error("헬피 거리 기반 조회 실패:", err);
    sendError(res, "서버 오류로 헬피 목록을 가져오지 못했습니다.", err);
  }
};
