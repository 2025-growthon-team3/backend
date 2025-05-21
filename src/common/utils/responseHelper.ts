import { Response } from "express";
import { ApiSuccessResponse, ApiErrorResponse } from "@/types/ApiResponse";

/**
 * 
 * @param res 
 * @param message 
 * @param data 
 * @param statusCode 
 * @returns 
 */
export function sendSuccess<T>( 
  res: Response,
  message: string,
  data: T,
  statusCode = 200
) {
  const response: ApiSuccessResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
}

/**
 * 
 * @param res 
 * @param message 
 * @param error 
 * @param statusCode 
 * @returns 
 */
export function sendError(
  res: Response,
  message: string,
  error: any = null,
  statusCode = 500
) {
  const response: ApiErrorResponse = {
    success: false,
    message,
    error,
  };
  return res.status(statusCode).json(response);
}
