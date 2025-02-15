
export type RefreshTokenResult= {
  accessToken: string;
  refreshToken: string;
}

export type HttpResponse<T = unknown> = {
  code: number;
  message: string | null;
  data: T;
  success: boolean;
  timestamp?: string;
}

export interface PagingResponse<T = unknown> {
  pageNum?: number;
  pageSize?: number;
  total?: number;
  list?: T[];
}

export type AnyObject = { [key: string]: unknown }