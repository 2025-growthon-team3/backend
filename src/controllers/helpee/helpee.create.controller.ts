import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { HelpeeEntity } from "@/entity/HelpeeEntity";
import { InstitutionEntity } from "@/entity/InstitutionEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";

export const createHelpee = async (req: Request, res: Response) => {
  const { name, age, birth, gender, institutionName, helpRequest, helpDetail } =
    req.body;

  try {
    const institutionRepo = AppDataSource.getRepository(InstitutionEntity);
    const helpeeRepo = AppDataSource.getRepository(HelpeeEntity);

    // 1. 기관 이름으로 institution 조회
    const institution = await institutionRepo.findOneBy({
      name: institutionName,
    });
    if (!institution) {
      sendError(res, "해당 기관을 찾을 수 없습니다", { institutionName });
      return;
    }

    // 2. 생년월일 문자열 포맷 보정
    let birthDate: string | undefined = undefined;
    if (birth) {
      const formatted = birth.toString().padStart(6, "0"); // 예: 051212 → '051212'
      birthDate = `20${formatted.slice(0, 2)}-${formatted.slice(
        2,
        4
      )}-${formatted.slice(4, 6)}`;
    }

    // 3. Helpee 생성 및 저장
    const newHelpee = helpeeRepo.create({
      name,
      age,
      birthDate,
      gender,
      helpRequestDetail: helpRequest,
      helpDetail,
      institution,
    });

    await helpeeRepo.save(newHelpee);
    sendSuccess(res, "헬피 등록 성공", newHelpee);
  } catch (err) {
    console.error("헬피 등록 오류:", err);
    sendError(res, "헬피 등록 중 오류 발생", err);
  }
};
