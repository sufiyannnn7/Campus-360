/**
 * Scalable API Contracts and Response Types
 */

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  details?: Record<string, any>;
  timestamp?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface GlobalSearchResult {
  events: any[];
  clubs: any[];
  news: any[];
  venues: any[];
}
