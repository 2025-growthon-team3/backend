// src/controllers/volunteer/volunteer.update-status.controller.ts
import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { VolunteerApplicationEntity } from "@/entity/VounteerApplicationEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";

export const updateVolunteerStatus = async (req: Request, res: Response) => {
  const { volunteerId } = req.params;
  const { status } = req.body;

  // 허용된 status 값 체크
  const validStatuses = ["approved", "rejected"];
  if (!validStatuses.includes(status)) {
    sendError(res, "유효하지 않은 상태 값입니다.", { status }, 400);
    return;
  }

  try {
    const volunteerRepo = AppDataSource.getRepository(
      VolunteerApplicationEntity
    );
    const application = await volunteerRepo.findOneBy({
      id: Number(volunteerId),
    });

    if (!application) {
      sendError(
        res,
        "해당 봉사 신청을 찾을 수 없습니다.",
        { volunteerId },
        404
      );
      return;
    }

    application.status = status as typeof application.status;
    await volunteerRepo.save(application);

    sendSuccess(res, "상태가 성공적으로 업데이트되었습니다.", application);
  } catch (err) {
    console.error("봉사 상태 업데이트 실패:", err);
    sendError(res, "봉사 상태 업데이트 중 오류 발생", err);
  }
};
