import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { HelpeeEntity } from "@/entity/HelpeeEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";

export const deleteHelpeeById = async (req: Request, res: Response) => {
  const helpeeId = Number(req.params.id);

  if (req.role !== "institution") {
    sendError(res, "기관 권한이 없습니다.", null, 401);
    return;
  }

  if (isNaN(helpeeId)) {
    sendError(res, "유효하지 않은 헬피 ID입니다.", { id: req.params.id }, 400);
  }

  try {
    const helpeeRepo = AppDataSource.getRepository(HelpeeEntity);

    const helpee = await helpeeRepo.findOneBy({ id: helpeeId });

    if (!helpee) {
      sendError(res, "해당 헬피를 찾을 수 없습니다.", { id: helpeeId }, 404);
      return;
    }

    await helpeeRepo.remove(helpee); // or helpeeRepo.delete(helpeeId);

    sendSuccess(res, "헬피 삭제 성공", { id: helpeeId });
  } catch (err) {
    console.error("헬피 삭제 오류:", err);
    sendError(res, "헬피 삭제 중 오류 발생", err);
  }
};
