import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import { UserEntity } from "./entity/UserEntity";

import authRouter from "./routes/auth/auth.route";
import helpeeRouter from "./routes/helpee/helpee.route";
import institutionRouter from "./routes/institution/institution.route";
import helperRouter from "./routes/helper/helper.route";
import volunteerRouter from "./routes/volunteer/volunteer.route";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173" }));

app.use("/api/auth", authRouter);
app.use("/api/helpee", helpeeRouter);
app.use("/api/institution", institutionRouter);
app.use("/api/helpers", helperRouter);
app.use("/api/volunteer", volunteerRouter);

async function connectWithRetry() {
  const RETRY_INTERVAL = 3000;

  while (true) {
    try {
      await AppDataSource.initialize();
      console.log("✅ DB 연결 성공");

      app.get("/", (req, res) => {
        res.status(200).send("OK");
      });

      app.get("/users", async (req, res) => {
        const users = await AppDataSource.getRepository(UserEntity).find();
        res.json(users);
      });

      app.post("/users", async (req, res) => {
        const { name } = req.body;
        const user = AppDataSource.getRepository(UserEntity).create({ name });
        const result = await AppDataSource.getRepository(UserEntity).save(user);
        res.json(result);
      });

      if (process.env.ENV !== "DEV") {
        const server = app.listen(3000, "0.0.0.0", () => {
          console.log("🚀 서버 실행 중: http://localhost:3000");
        });
        server.keepAliveTimeout = 190_000;
      } else {
        app.listen(3001, () => {
          console.log("🚀 서버 실행 중: http://localhost:3001");
        });
      }

      break;
    } catch (err: unknown) {
      console.error("❌ DB 연결 실패. 3초 후 재시도...", err);
      await new Promise((res) => setTimeout(res, RETRY_INTERVAL));
    }
  }
}

connectWithRetry();
