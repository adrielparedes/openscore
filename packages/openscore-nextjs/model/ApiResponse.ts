export interface ApiResponse<T> {
  error: string;
  description: string;
  data: T;
}
