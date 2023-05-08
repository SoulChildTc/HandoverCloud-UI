import { defineStore } from "pinia";
import { store } from "@/store";
import { getClusterList, ClusterList, Data } from "@/api/k8s/cluster";

type Option = {
  value: string;
  label: string;
};

export const useClusterStore = defineStore({
  id: "k8s-cluster",
  state: () => {
    return {
      // currentCluster: "",
      clusterList: [] as Data[],
      opts: [] as Option[]
    };
  },

  getters: {
    clusterNames() {
      const opts: Option[] = [];
      this.clusterList.forEach(item => {
        opts.push({ label: item.clusterName, value: item.clusterName });
      });
      return opts;
    },
    currentCluster() {
      return localStorage.getItem("currentCluster") ?? "";
    }
  },

  actions: {
    async refreshClusterList() {
      return new Promise<ClusterList>((resolve, reject) => {
        getClusterList()
          .then(data => {
            if (data.status === "success") {
              this.clusterList = data.data;
              this.initCurrentCluster();
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    initCurrentCluster() {
      const exists = this.clusterList.some(
        item => item.name === this.localClusterName
      );

      if (!exists) {
        // 如果本地存储的集群不在集群列表中,清空currentCluster, 让用户重新选择
        // this.currentCluster = "";
        localStorage.removeItem("currentCluster");
      }
    },
    setCurrentCluster(val) {
      // this.currentCluster = val;
      localStorage.setItem("currentCluster", val);
    }
  }
});

export function useClusterStoreHook() {
  return useClusterStore(store);
}
