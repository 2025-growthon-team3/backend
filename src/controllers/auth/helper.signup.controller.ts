/**
 * @swagger
 * /auth/signup/helper:
 *   patch:
 *     summary: 헬퍼 회원가입
 *     description: 카카오 로그인 후 추가 정보를 입력하여 헬퍼로 등록합니다.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - kakaoId
 *               - name
 *               - residentNumber
 *               - address
 *             properties:
 *               kakaoId:
 *                 type: string
 *                 example: "123456789"
 *               name:
 *                 type: string
 *                 example: "홍길동"
 *               residentNumber:
 *                 type: string
 *                 example: "900101-1234567"
 *               address:
 *                 type: string
 *                 example: "서울특별시 강남구 역삼동"
 *     responses:
 *       200:
 *         description: 헬퍼 등록 성공 및 JWT 반환
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
 *                   example: 헬퍼 등록 성공
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: 필수 항목 누락 또는 잘못된 요청
 *       404:
 *         description: 유저 없음 또는 주소 없음
 *       409:
 *         description: 이미 등록된 헬퍼
 *       500:
 *         description: 서버 오류
 */



import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { HelperEntity } from "@/entity/HelperEntity";
import { UserEntity } from "@/entity/UserEntity";
import { sendSuccess, sendError } from "@/common/utils/responseHelper";
import jwt from "jsonwebtoken";

import axios from "axios";
export const createHelper = async (req: Request, res: Response) => {
  const { name, residentNumber, address, kakaoId } = req.body;

  if (!kakaoId || !name || !residentNumber || !address) {
    sendError(
      res,
      "필수 항목 누락",
      { kakaoId, name, residentNumber, address },
      400
    );
    return;
  }

  try {
    const userRepo = AppDataSource.getRepository(UserEntity);
    const helperRepo = AppDataSource.getRepository(HelperEntity);

    // 1. 카카오 ID로 유저 조회
    const user = await userRepo.findOneBy({ kakaoId });

    if (!user) {
      sendError(res, "해당 유저를 찾을 수 없습니다.", { kakaoId }, 404);
      return;
    }

    let latitude: number | undefined;
    let longitude: number | undefined;

    // 주소가 있을 경우 Google Geocoding API 호출
    if (address) {
      const geoRes: any = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address,
            key: "AIzaSyBhdkQHt1WFsqd961XXSqK5ac-qou_5jaI",
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

    user.role = "helper";
    user.isFirstLogin = false;
    user.latitude = latitude;
    user.longitude = longitude;

    await userRepo.save(user);

    // 2. 유저에 연결된 헬퍼 중복 확인
    const existingHelper = await helperRepo.findOneBy({
      user: { id: user.id },
    });
    if (existingHelper) {
      sendError(res, "이미 헬퍼로 등록된 사용자입니다.");
      return;
    }

    // 3. HelperEntity 생성 및 저장
    const helper = helperRepo.create({
      user,
      residentNumber,
      address,
    });
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );
    await helperRepo.save(helper);

    sendSuccess(res, "헬퍼 등록 성공", { accessToken: token });
  } catch (err) {
    console.error("헬퍼 등록 오류:", err);
    sendError(res, "헬퍼 등록 중 오류 발생", err);
  }
};
