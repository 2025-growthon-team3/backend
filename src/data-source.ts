// src/data-source.ts
import { DataSource } from "typeorm";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "mysql", // ✅ 컨테이너끼리의 내부 주소
  port: 3306, // ✅ MySQL 기본 포트
  username: "root",
  password: "rnfma!234",
  database: "cloudDB",
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
