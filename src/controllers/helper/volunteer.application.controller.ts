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
    const { helperId, helpeeId } = req.body;

    if (!helperId || !helpeeId) {
      sendError(res, "helperId와 helpeeId는 필수입니다.", "InvalidRequestBody");
      return;
    }

    const helperRepo = AppDataSource.getRepository(HelperEntity);
    const helpeeRepo = AppDataSource.getRepository(HelpeeEntity);

    const helper = await helperRepo.findOne({ where: { id: helperId } });
    const helpee = await helpeeRepo.findOne({ where: { id: helpeeId } });

    if (!helper || !helpee) {
      sendError(res, "해당 helper 또는 helpee를 찾을 수 없습니다.", "EntityNotFound");
      return;
    }

    const volunteerAppRepo = AppDataSource.getRepository(VolunteerApplicationEntity);

    const newApplication = volunteerAppRepo.create({
      helper,
      helpee,
      status: "requested",
    });

    await volunteerAppRepo.save(newApplication);

    sendSuccess(res, "봉사 신청 성공", {
      helperId,
      helpeeId,
    }, 201);
  } catch (err) {
    console.error("봉사 신청 중 오류:", err);
    sendError(res, "봉사 신청 중 오류 발생", err);
  }
};
