// controllers/helpeesController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { HelpeeEntity } from "../entity/HelpeeEntity";
import { Raw } from "typeorm";
import { InstitutionEntity } from "../entity/InstitutionEntity";

export const getUnmatchedHelpees = async (req: Request, res: Response) => {
  try {
    const helpeeRepository = AppDataSource.getRepository(HelpeeEntity);

    const unmatchedHelpees = await helpeeRepository.find({
      where: [
        { isMatched: false },
        { isMatched: Raw((alias) => `${alias} IS NULL`) },
      ],
      relations: ["institution"],
      order: { createdAt: "DESC" },
    });

    res.status(200).json({
      success: true,
      message: "매칭되지 않은 헬피 리스트 조회 성공",
      data: unmatchedHelpees,
    });
  } catch (error) {
    console.error("매칭되지 않은 헬피 리스트 조회 실패:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
      error,
    });
  }
};

