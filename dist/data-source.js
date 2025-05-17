"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
// src/data-source.ts
const typeorm_1 = require("typeorm");
const User_1 = require("./entity/User");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "mysql", // ✅ 컨테이너끼리의 내부 주소
    port: 3306, // ✅ MySQL 기본 포트
    username: "root",
    password: "rnfma!234",
    database: "cloudDB",
    synchronize: true,
    logging: false,
    entities: [User_1.User],
    migrations: [],
    subscribers: [],
});
