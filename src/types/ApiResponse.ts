// src/types/common/ApiResponse.ts

// 공통 응답 타입 (성공)
export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

// 공통 응답 타입 (에러)
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: any;
}

// 통합 응답 타입
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
