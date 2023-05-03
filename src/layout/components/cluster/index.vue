<script lang="ts" setup>
import { onMounted } from "vue";
import { useClusterStore } from "@/store/modules/cluster";

const clusterInfo = useClusterStore();

onMounted(async () => {
  await clusterInfo.refreshClusterList();
});

const handleSelected = val => {
  clusterInfo.setCurrentCluster(val);
};
</script>

<template>
  <p class="mr-2 text-sm">当前集群</p>
  <el-select
    class="w-auto inline-block"
    v-model="clusterInfo.currentCluster"
    @change="handleSelected"
    filterable
    placeholder="请选择集群"
  >
    <el-option
      v-for="item in clusterInfo.clusterNames"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>
