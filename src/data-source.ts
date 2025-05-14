// src/data-source.ts
import { DataSource } from 'typeorm'
import { User } from './entity/User'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: '127.27.48.1', // 또는 Docker 실행 PC의 IP
  port: 3305,
  username: 'root',
  password: 'rnfma!234',
  database: 'cloudDB',
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
})
