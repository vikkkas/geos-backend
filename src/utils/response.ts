import { Response } from 'express';
import { ApiResponse } from '../types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  pagination?: ApiResponse<T>['pagination']
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(pagination && { pagination }),
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  error: string,
  statusCode: number = 500
): Response => {
  const response: ApiResponse<null> = {
    success: false,
    error,
  };
  return res.status(statusCode).json(response);
};
