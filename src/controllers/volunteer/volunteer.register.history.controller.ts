import { VolunteerApplicationEntity } from "@/entity/VounteerApplicationEntity";
import { VolunteerHistoryEntity } from "@/entity/VolunteerHistoryEntity";
import { sendError, sendSuccess } from "@/common/utils/responseHelper";
import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { parseISO, isValid } from "date-fns";

export const volunteerRegisterHistory = async (req: Request, res: Response) => {
  const { helpTime } = req.body;
  const applicationId = Number(req.params.applicationId);

  if (isNaN(applicationId)) {
    sendError(res, "올바른 신청 ID가 아닙니다.");
    return;
  }

  // 날짜 형식 유효성 검사
  const parsedDate = parseISO(helpTime);
  if (!isValid(parsedDate)) {
    sendError(res, "날짜 형식이 올바르지 않습니다. (예: 2025-06-01)");
    return;
  }

  const app = await AppDataSource.getRepository(
    VolunteerApplicationEntity
  ).findOne({
    where: { id: applicationId },
    relations: ["helper", "helpee"],
  });

  if (!app || app.status !== "approved") {
    sendError(res, "유효하지 않은 승인된 신청입니다.");
    return;
  }

  app.isCompleted = true;
  await AppDataSource.getRepository(VolunteerApplicationEntity).save(app);

  const history = AppDataSource.getRepository(VolunteerHistoryEntity).create({
    helper: app.helper,
    helpee: app.helpee,
    helpTime: parsedDate, // DATE형으로 저장
  });

  await AppDataSource.getRepository(VolunteerHistoryEntity).save(history);

  sendSuccess(res, "봉사 등록이 완료되었습니다.", { history });
};
