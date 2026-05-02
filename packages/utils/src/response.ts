import type { ApiResponse, PaginatedResponse } from '@app/types';

export const successResponse = <T>(data: T, metadata?: Record<string, any>): ApiResponse<T> => ({
  success: true,
  data,
  metadata: { timestamp: new Date().toISOString(), ...metadata },
});

export const errorResponse = (code: string, message: string, details?: any): ApiResponse => ({
  success: false,
  error: { code, message, details },
  metadata: { timestamp: new Date().toISOString() },
});

export const paginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number,
): PaginatedResponse<T> => ({
  data,
  total,
  page,
  pageSize,
  totalPages: Math.ceil(total / pageSize),
});
