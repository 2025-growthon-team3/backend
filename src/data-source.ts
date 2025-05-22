import { DataSource } from "typeorm";
import { UserEntity } from "./entity/UserEntity";
import { HelperEntity } from "./entity/HelperEntity";
import { HelpeeEntity } from "./entity/HelpeeEntity";
import { InstitutionUserEntity } from "./entity/InstitutionUserEntity";
import { InstitutionEntity } from "./entity/InstitutionEntity";
import { VolunteerApplicationEntity } from "./entity/VounteerApplicationEntity";
import { VolunteerHistoryEntity } from "./entity/VolunteerHistoryEntity";
import dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.ENV === "REL" ? process.env.REL_DB_HOST : "127.0.0.1",
  port: Number(process.env.ENV === "REL" ? process.env.REL_DB_PORT : 3305),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [
    UserEntity,
    HelperEntity,
    HelpeeEntity,
    InstitutionUserEntity,
    InstitutionEntity,
    VolunteerApplicationEntity,
    VolunteerHistoryEntity,
  ],
  migrations: [],
  subscribers: [],
});
