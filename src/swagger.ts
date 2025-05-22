// src/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth API Docs",
      version: "1.0.0",
      description: "카카오 로그인 및 회원가입 관련 API 문서",
    },
    servers: [
      {
        url: "https://api.cloudthon.r-e.kr",    
      },
    ],
  },
  apis: ["./src/controllers/**/*.ts", "./src/routes/**/*.ts"], 
};

export const swaggerSpec = swaggerJsdoc(options);
