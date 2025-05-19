// src/data-source.ts
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import dotenv from 'dotenv';
dotenv.config(); 


export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.ENV === "REL" ? process.env.REL_DB_HOST : '127.0.0.1',
  port: Number(process.env.ENV === "REL" ? process.env.REL_DB_PORT : 3305),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [User],
  migrations: [],
  subscribers: [],
});

