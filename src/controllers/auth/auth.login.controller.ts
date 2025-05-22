/**
 * @swagger
 * /auth/login:
 *   get:
 *     summary: 카카오 로그인
 *     description: 카카오 인가 코드를 이용하여 로그인하고 JWT 토큰을 발급받습니다.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: 카카오 인가 코드 (redirect_uri를 통해 전달받은 코드)
 *     responses:
 *       200:
 *         description: 로그인 성공 및 JWT 반환
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
 *                   example: 카카오 로그인 성공
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6...
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: number
 *                         name:
 *                           type: string
 *                         profileImage:
 *                           type: string
 *                         role:
 *                           type: string
 *                         isFirstLogin:
 *                           type: boolean
 *       400:
 *         description: 잘못된 요청 (code 누락 등)
 *       500:
 *         description: 서버 내부 오류 또는 카카오 인증 실패
 */
  
  
  import axios from "axios";
  import { AppDataSource } from "@/data-source";
  import { UserEntity } from "@/entity/UserEntity";
  import jwt from "jsonwebtoken";
  import dotenv from "dotenv";
  import { Request, Response } from "express";
  import { toUserResponseDto } from "@/utils/auth/toUserResponseDTO";
  import { sendError, sendSuccess } from "@/common/utils/responseHelper";

  dotenv.config();

  // 카카오에서 오는 유저 정보 타입 정의
  type KakaoUserResponse = {
    id: number;
    properties: {
      nickname: string;
      profile_image: string;
    };
    kakao_account: {
      email?: string;
    };
  };

  export const kakaoLogin = async (req: Request, res: Response) => {
    const code = req.query.code as string;

    try {
      // 1. 인가 코드로 액세스 토큰 요청
      const tokenRes = await axios.post<{ access_token: string }>(
        "https://kauth.kakao.com/oauth/token",
        null,
        {
          params: {
            grant_type: "authorization_code",
            client_id: process.env.KAKAO_REST_API_KEY,
            redirect_uri: process.env.KAKAO_REDIRECT_URI,
            code,
          },
          headers: {
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      );

      const accessToken = tokenRes.data.access_token;

      // 2. 사용자 정보 요청
      const userRes = await axios.get<KakaoUserResponse>(
        "https://kapi.kakao.com/v2/user/me",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const kakaoUser = userRes.data;
      const kakaoId = kakaoUser.id.toString();
      const nickname = kakaoUser.properties?.nickname || "Unknown";
      const profileImage = kakaoUser.properties?.profile_image || "";

      // 3. DB에서 사용자 찾거나 생성
      let user = await AppDataSource.getRepository(UserEntity).findOneBy({
        kakaoId,
      });

      if (!user) {
        user = AppDataSource.getRepository(UserEntity).create({
          kakaoId,
          name: nickname,
          profileImage,
        });
        await AppDataSource.getRepository(UserEntity).save(user);
      }

      // 4. JWT 발급
      let token = "";
      if (!user.isFirstLogin) {
        token = jwt.sign(
          {
            userId: user.id,
            role: user.role,
          },
          process.env.JWT_SECRET!,
          {
            expiresIn: "7d",
          }
        );
      }

      const safeUser = await toUserResponseDto(user);

      sendSuccess(res, "카카오 로그인 성공", { accessToken: token, user: safeUser });
    } catch (err) {
      console.error("카카오 로그인 에러:", err);
      sendError(res, "카카오 로그인 실패", err);
    }
  };

  export default kakaoLogin;
