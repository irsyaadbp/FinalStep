export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: { [k: string]: string[] };
}

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
