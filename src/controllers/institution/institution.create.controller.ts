/**
 * @swagger
 * /institution:
 *   post:
 *     summary: 기관 등록
 *     description: 기관 이름, 소유자, 주소, 전화번호를 기반으로 기관을 등록합니다. 주소로부터 위도/경도를 Google Geocoding API를 통해 계산합니다.
 *     tags:
 *       - Institution
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - institutionOwner
 *               - address
 *               - phoneNumber
 *             properties:
 *               name:
 *                 type: string
 *                 example: "행복복지센터"
 *               institutionOwner:
 *                 type: string
 *                 example: "홍길동"
 *               address:
 *                 type: string
 *                 example: "서울특별시 강남구 테헤란로 123"
 *               phoneNumber:
 *                 type: string
 *                 example: "02-123-4567"
 *     responses:
 *       200:
 *         description: 기관 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 기관 등록 성공
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     name:
 *                       type: string
 *                     institutionOwner:
 *                       type: string
 *                     address:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *                     latitude:
 *                       type: number
 *                     longitude:
 *                       type: number
 *       404:
 *         description: 주소가 입력되지 않음
 *       500:
 *         description: 서버 오류 또는 지오코딩 실패
 */

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
    const institutionRepo = AppDataSource.getRepository(InstitutionEntity);


    const existing = await institutionRepo.findOneBy({ name });
    if (existing) {
      sendError(res, "이미 존재하는 기관 이름입니다.", { name }, 409);
      return;
    }

    let latitude: number | undefined;
    let longitude: number | undefined;

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
      sendError(res, "주소가 없습니다.", 400);
      return;
    }

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
