import express from "express";
import axios from "axios";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

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

router.get("/kakao/callback", async (req, res) => {
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
    const email = kakaoUser.kakao_account?.email || "";

    // 3. DB에서 사용자 찾거나 생성
    let user = await AppDataSource.getRepository(User).findOneBy({ kakaoId });

    if (!user) {
      user = AppDataSource.getRepository(User).create({
        kakaoId,
        name: nickname,
        email,
        profileImage,
      });
      await AppDataSource.getRepository(User).save(user);
    }

    // 4. JWT 발급
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (err) {
    console.error("카카오 로그인 에러:", err);
    res.status(500).json({ message: "카카오 로그인 실패" });
  }
});

export default router;
