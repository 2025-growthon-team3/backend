import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import "module-alias/register";
import authRouter from "./routes/auth/auth.route";
import helpeeRouter from "./routes/helpee/helpee.route";
import institutionRouter from "./routes/institution/institution.route";
import helperRouter from "./routes/helper/helper.route";
import volunteerRouter from "./routes/volunteer/volunteer.route";
import devRouter from "./routes/dev/dev.route";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173" }));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRouter);
app.use("/api/helpee", helpeeRouter);
app.use("/api/institution", institutionRouter);
app.use("/api/helper", helperRouter);
app.use("/api/volunteer", volunteerRouter); 
app.use("/api/test", devRouter);

async function connectWithRetry() {
  const RETRY_INTERVAL = 3000;

  while (true) {
    try {
      await AppDataSource.initialize();
      console.log("✅ DB 연결 성공");

      app.get("/", (req, res) => {
        res.status(200).send("OK");
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
