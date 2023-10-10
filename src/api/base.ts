export type ResponseBase<T = {}> = {
  status: string;
  msg: string;
  data: T;
};

export type PageReq = {
  namespace?: string;
  page?: number;
  limit?: number;
  filter?: string;
};

export type PageResponse = {
  limit: number;
  page: number;
  total: number;
  items: any[];
};
