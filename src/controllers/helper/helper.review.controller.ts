// src/controllers/helper/updateHelperVerifiedTrue.ts
import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { HelperEntity } from "@/entity/HelperEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";

export const verifyHelper = async (req: Request, res: Response) => {
  const { helperId } = req.params;

  if (!helperId || isNaN(Number(helperId))) {
    sendError(res, "유효한 helperId를 입력해주세요.", null, 400);
    return;
  }

  try {
    const helperRepo = AppDataSource.getRepository(HelperEntity);
    const helper = await helperRepo.findOne({ where: { id: Number(helperId) } });

    if (!helper) {
      sendError(res, "해당 헬퍼를 찾을 수 없습니다.", { helperId }, 404);
      return;
    }

    helper.isVerified = true;
    await helperRepo.save(helper);

    sendSuccess(res, "헬퍼 인증 완료", { id: helper.id, isVerified: true });
  } catch (err) {
    console.error("헬퍼 인증 처리 실패:", err);
    sendError(res, "헬퍼 인증 처리 중 오류 발생", err);
  }
};
