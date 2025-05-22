import axios from "axios";
import { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { InstitutionEntity } from "../../entity/InstitutionEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";
import dotenv from "dotenv";

dotenv.config();

export const createInstitution = async (req: Request, res: Response) => {
  const { name, institutionOwner, address, phoneNumber } = req.body;

  try {
    let latitude: number | undefined;
    let longitude: number | undefined;

    // 주소가 있을 경우 Google Geocoding API 호출
    if (address) {
      const geoRes: any = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address,
            key: process.env.GOOGLE_API_KEY,
          },
        }
      );

      const results = geoRes.data.results;
      if (results && results.length > 0) {
        const location = results[0].geometry.location;
        latitude = location.lat;
        longitude = location.lng;
      }
    } else {
      sendError(res, "주소가 없습니다.", 404);
      return;
    }

    // 기관 엔티티 생성
    const institutionRepo = AppDataSource.getRepository(InstitutionEntity);
    const institution = institutionRepo.create({
      name,
      institutionOwner,
      address,
      phoneNumber,
      latitude,
      longitude,
    });

    await institutionRepo.save(institution);
    sendSuccess(res, "기관 등록 성공", institution);
  } catch (err) {
    console.error("기관 등록 실패:", err);
    sendError(res, "기관 등록 중 오류 발생", err);
  }
};
