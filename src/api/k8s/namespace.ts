import { http } from "@/utils/http";
import { PageReq, ResponseBase, PageResponse } from "../base";

/* 获取名称空间列表 */
export const getNamespaceList = (data: PageReq) => {
  const clusterName = localStorage.getItem("currentCluster");
  const { page, limit, filter } = data;
  return http.get<any, ResponseBase<PageResponse>>(
    `/api/v1/k8s/${clusterName}/namespace/`,
    {
      params: {
        page: page,
        limit: limit,
        filter: filter
      }
    }
  );
};
