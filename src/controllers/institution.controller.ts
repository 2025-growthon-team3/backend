import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { InstitutionEntity } from "../entity/InstitutionEntity";

export const createInstitution = async (req: Request, res: Response) => {
  try {
    const { name, institutionCode, address, phoneNumber } = req.body;

    if (!name || !institutionCode) {
      res.status(400).json({
        success: false,
        message: "name과 institutionCode는 필수입니다.",
      });
    }

    const institutionRepo = AppDataSource.getRepository(
      InstitutionEntity
    );

    const institution = institutionRepo.create({
      name,
      institutionCode,
      address,
      phoneNumber,
    });

    await institutionRepo.save(institution);

    res.status(201).json({
      success: true,
      message: "기관 등록 성공",
      data: institution,
    });
  } catch (error) {
    console.error("기관 등록 실패:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류 발생",
      error,
    });
  }
};
