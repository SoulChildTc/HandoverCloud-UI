import { http } from "@/utils/http";
import { ResponseBase, PageResponse } from "../base";

/* 获取指定Pod信息 */
export const getPodByName = (data: { namespace: string; name: string }) => {
  const clusterName = localStorage.getItem("currentCluster");
  const { namespace, name } = data;
  return http.get<any, ResponseBase<PageResponse>>(
    `/api/v1/k8s/${clusterName}/pod/${namespace}/${name}`
  );
};
