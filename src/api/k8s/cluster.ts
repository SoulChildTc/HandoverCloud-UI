import { http } from "@/utils/http";
import { ResponseBase } from "../base";

export interface TLSClientConfig {
  insecure: boolean;
  certData: string;
  keyData: string;
  caData: string;
}

export interface ClusterList {
  clusterName: string;
  host: string;
  bearerToken: string;
  tlsClientConfig: TLSClientConfig;
  version: string;
  status: string;
  nodeNum: number;
}

export type CreateOrUpdateCluster = {
  clusterName: string;
  host: string;
  bearerToken: string;
  tlsClientConfig: TLSClientConfig;
};

/** 获取集群列表 */
export const getClusterList = (force = false) => {
  return http.get<any, ResponseBase<ClusterList[]>>(
    `/api/v1/k8s/cluster/?force=${force}`
  );
};

/** 删除集群 */
export const deleteCluster = (clusterName: string) => {
  return http.request<ResponseBase>(
    "delete",
    `/api/v1/k8s/cluster/${clusterName}/`
  );
};

/** 更新集群 */
export const updateCluster = (data: CreateOrUpdateCluster) => {
  return http.request<ResponseBase>(
    "put",
    `/api/v1/k8s/cluster/${data.clusterName}/`,
    { data }
  );
};

/** 创建集群 */
export const createCluster = (data: CreateOrUpdateCluster) => {
  return http.request<ResponseBase>(
    "post",
    `/api/v1/k8s/cluster/${data.clusterName}/`,
    { data }
  );
};
