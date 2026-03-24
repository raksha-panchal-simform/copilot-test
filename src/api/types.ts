export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
  pagination?: Pagination;
}

export interface ApiError {
  code: string;
  message: string;
  details?: string[];
}

export interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}
