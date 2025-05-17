"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
// src/data-source.ts
const typeorm_1 = require("typeorm");
const User_1 = require("./entity/User");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: '127.27.48.1', // 또는 Docker 실행 PC의 IP
    port: 3305,
    username: 'root',
    password: 'rnfma!234',
    database: 'cloudDB',
    synchronize: true,
    logging: false,
    entities: [User_1.User],
    migrations: [],
    subscribers: [],
});
