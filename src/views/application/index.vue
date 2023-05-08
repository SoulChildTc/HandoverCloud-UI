<script setup lang="ts">
import { ref } from "vue";
// import { getDeoloymentList } from "@/api/k8s/deployment";

import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useData } from "./data";
// import Database from "@iconify-icons/ri/database-2-line";
// import More from "@iconify-icons/ep/more-filled";
// import Delete from "@iconify-icons/ep/delete";
// import EditPen from "@iconify-icons/ep/edit-pen";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
// import Menu from "@iconify-icons/ep/menu";
import AddFill from "@iconify-icons/ri/add-circle-line";

const {
  loading,
  columns,
  dataList,
  pagination,
  // loadingConfig,
  getData,
  // expand,
  onSizeChange,
  onCurrentChange
  // onSelectionChange
} = useData();

const filterFormRef = ref();
const form = ref<{
  name?: string;
  namespace?: string;
}>({});
</script>

<template>
  <div>
    <el-form
      ref="filterFormRef"
      :inline="true"
      :model="form"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-form-item label="名称空间: " prop="namespace">
        <el-input
          v-model="form.namespace"
          placeholder="请输入名称空间"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="应用名称: " prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入应用名称"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select
          v-model="form.status"
          placeholder="请选择状态"
          clearable
          class="!w-[180px]"
        >
          <el-option label="已开启" value="1" />
          <el-option label="已关闭" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="getData({})"
        >
          搜索
        </el-button>
        <el-button
          :icon="useRenderIcon(Refresh)"
          @click="resetForm(filterFormRef)"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <PureTableBar title="应用列表" @refresh="getData">
      <template #buttons>
        <el-button type="primary" :icon="useRenderIcon(AddFill)">
          创建应用
        </el-button>
      </template>
      <template v-slot="{ size, checkList }">
        <pure-table
          border
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          lazy
          row-key="metadata.name"
          :expand-row-keys="['metadata.name']"
          :load="expand"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="columns"
          :checkList="checkList"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-table-row-hover-bg-color)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="onSelectionChange"
          @page-size-change="onSizeChange"
          @page-current-change="onCurrentChange"
        >
          <template #operation="{ row }">
            <el-button type="primary">Modify{{ row.metadata.name }}</el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style scoped></style>
