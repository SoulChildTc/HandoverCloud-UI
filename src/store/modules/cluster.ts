import { defineStore } from "pinia";
import { getClusterList, ClusterList, Data } from "@/api/k8s/cluster";

type Option = {
  value: string;
  label: string;
};

export const useClusterStore = defineStore({
  id: "k8s-cluster",
  state: () => {
    return {
      currentCluster: "",
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
      const localClusterName = localStorage.getItem("currentCluster");

      // 如果本地存储的集群在集群列表中, 使用这个集群
      const exists = this.clusterList.some(
        item => item.clusterName === localClusterName
      );

      if (exists) {
        // 设置本地存储的集群为当前选择的集群
        this.currentCluster = localClusterName;
        return;
      }

      // 如果不存在,清空currentCluster, 让用户重新选择
      this.currentCluster = "";
      localStorage.removeItem("currentCluster");
    },
    setCurrentCluster(val) {
      this.currentCluster = val;
      localStorage.setItem("currentCluster", val);
    }
  }
});
