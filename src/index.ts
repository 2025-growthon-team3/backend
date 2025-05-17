console.log("index.ts 실행됨");

import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route";
import { AppDataSource } from "./data-source";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);

AppDataSource.initialize()
  .then(() => {
    console.log("DB connected");
  })
  .catch((error) => {
    console.error("❌ DB 연결 실패:", error);
  });

app.listen(3000, () => {
  console.log("서버 실행 중: http://localhost:3000");
});

app.get("/", (req, res) => {
  res.send("서버가 살아 있습니다");
});
