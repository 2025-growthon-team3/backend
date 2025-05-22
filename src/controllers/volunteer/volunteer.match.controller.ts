import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { VolunteerApplicationEntity } from "@/entity/VounteerApplicationEntity";
import { HelperEntity } from "@/entity/HelperEntity";
import { HelpeeEntity } from "@/entity/HelpeeEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";

export const createVolunteerApplication = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId || isNaN(Number(userId))) {
      sendError(res, "토큰이 없거나 userId가 유효하지 않습니다.", null, 401);
      return;
    }

    const { helpeeId } = req.params;
    if (!helpeeId) {
      sendError(res, "helpeeId는 필수입니다.", "InvalidRequestBody");
      return;
    }

    // 1. userId로 헬퍼 조회
    const helperRepo = AppDataSource.getRepository(HelperEntity);
    const helper = await helperRepo.findOne({
      where: { user: { id: Number(userId) } },
    });

    if (!helper) {
      sendError(res, "해당 userId로 연결된 헬퍼가 없습니다.", "HelperNotFound");
      return;
    }

    // 2. 헬피 조회
    const helpee = await AppDataSource.getRepository(HelpeeEntity).findOne({
      where: { id: Number(helpeeId) },
    });

    if (!helpee) {
      sendError(res, "해당 helpee를 찾을 수 없습니다.", "HelpeeNotFound");
      return;
    }

    // 3. 중복 신청 체크
    const volunteerAppRepo = AppDataSource.getRepository(
      VolunteerApplicationEntity
    );
    const exists = await volunteerAppRepo.findOne({
      where: { helper: { id: helper.id }, helpee: { id: helpee.id } },
    });

    if (exists) {
      sendError(res, "이미 신청된 봉사입니다.", "DuplicateApplication");
      return;
    }

    // 4. 신청 저장
    const newApplication = volunteerAppRepo.create({
      helper,
      helpee,
      status: "requested",
    });

    await volunteerAppRepo.save(newApplication);

    sendSuccess(
      res,
      "봉사 신청 성공",
      {
        helpeeId: helpee.id,
      },
      201
    );
  } catch (err) {
    console.error("봉사 신청 중 오류:", err);
    sendError(res, "봉사 신청 중 오류 발생", err);
  }
};
