import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { HelperEntity } from "@/entity/HelperEntity";
import { sendSuccess } from "@/utils/send.success";
import { sendError } from "@/utils/send.error";
import { UserEntity } from "@/entity/UserEntity";

// 심사신청
export const getReviewRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as UserEntity;

    if (!user || !user.helper) {
      sendError(res, "헬퍼 정보가 없습니다.", "HelperNotFound");
      return;
    }

    const helper = await AppDataSource.getRepository(HelperEntity).findOne({
      where: { id: user.helper.id },
      relations: ["volunteerApplications", "volunteerApplications.helpee"],
    });

    if (!helper) {
      sendError(res, "헬퍼를 찾을 수 없습니다.", "HelperNotFound");
      return;
    }

    const reviewRequests = helper.volunteerApplications.filter(
      (app) => app.status === "requested"
    );

    sendSuccess(res, "성공적", reviewRequests, 200);
  } catch (err) {
    console.error("심사 신청 조회 오류:", err);
    sendError(res, "심사 신청 조회 중 오류 발생", err);
  }
};
