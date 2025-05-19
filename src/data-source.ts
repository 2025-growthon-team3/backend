// src/data-source.ts
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import dotenv from 'dotenv';
dotenv.config(); 


export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.REL_DB_HOST,
  port: Number(process.env.REL_DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [User],
  migrations: [],
  subscribers: [],
});


//host: "mysql", // ✅ 컨테이너끼리의 내부 주소
//port: 3306, // ✅ MySQL 기본 포트