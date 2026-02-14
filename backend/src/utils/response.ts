import { ApiResponse } from '../types/shared';

export const success = <T>(message: string, data?: T): ApiResponse<T> => {
  return {
    success: true,
    message,
    data,
  };
};

export const error = (message: string, errors?: { [k: string]: string[] }): ApiResponse => {
  return {
    success: false,
    message,
    errors,
  };
};
