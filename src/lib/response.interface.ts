export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  payload?: T;
  timestamp: string;
  path?: string;
}

export function createSuccessResponse<T>(
  message: string,
  payload?: T,
  path?: string,
): ApiResponse<T> {
  return {
    success: true,
    message,
    payload,
    timestamp: new Date().toISOString(),
    path,
  };
}
