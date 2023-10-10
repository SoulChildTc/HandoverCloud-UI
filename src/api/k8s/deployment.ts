import { http } from "@/utils/http";
import { ResponseBase, PageReq, PageResponse } from "../base";

/* 获取应用列表 */
export const getDeoloymentList = (data: PageReq) => {
  const clusterName = localStorage.getItem("currentCluster");
  const { page, limit, filter } = data;
  const namespace = data.namespace ?? "";
  return http.get<any, ResponseBase<PageResponse>>(
    `/api/v1/k8s/${clusterName}/deployment/${namespace}`,
    {
      params: {
        page: page,
        limit: limit,
        filter: filter
      }
    }
  );
};

/* 获取Deployment管理的Pod */
export const getDeoloymentPods = (data: {
  namespace: string;
  name: string;
}) => {
  const clusterName = localStorage.getItem("currentCluster");
  const namespace = data.namespace ?? "";
  return http.get<any, ResponseBase<PageResponse>>(
    `/api/v1/k8s/${clusterName}/deployment/${namespace}/${data.name}/pods`
  );
};
