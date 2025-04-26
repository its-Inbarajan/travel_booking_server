export interface IApiResponse<T> {
  message: string;
  statuscode: number;
  responses?: T;
  error?: Error;
  success: boolean;
  pagination?: {
    totalCount: number;
    page: number;
    limit: number;
  };
}
