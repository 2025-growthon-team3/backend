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

export const createHelpee = async (req: Request, res: Response) => {
  const {
    name,
    gender,
    age,
    helpRequestDetail,
    isMatched,
    institutionId,
    helpTime,
    helpDetail,
  } = req.body;

  try {
    const institutionRepo = AppDataSource.getRepository(
      InstitutionEntity
    );
    const helpeeRepo = AppDataSource.getRepository(HelpeeEntity);

    const institution = await institutionRepo.findOneBy({ id: institutionId });
    if (!institution) {
      res
        .status(400)
        .json({ success: false, message: "기관을 찾을 수 없습니다." });
      return;
    }

    const helpee = helpeeRepo.create({
      name,
      gender,
      age,
      helpRequestDetail,
      isMatched,
      helpTime,
      helpDetail,
      institution,
    });

    await helpeeRepo.save(helpee);

    res.status(201).json({
      success: true,
      message: "헬피 등록 성공",
      data: helpee,
    });
  } catch (error) {
    console.error("헬피 등록 실패:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류 발생",
      error,
    });
  }
};
