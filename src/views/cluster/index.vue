<script setup lang="ts">
import { useColumns } from "./columns";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import AddFill from "@iconify-icons/ri/add-circle-line";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import Detail from "@iconify-icons/ep/message-box";
import { reactive, ref } from "vue";
import { FormInstance } from "element-plus";
import { rules } from "./rule";
import {
  CreateOrUpdateCluster,
  updateCluster,
  createCluster,
  deleteCluster
} from "@/api/k8s/cluster";
import { message } from "@/utils/message";

const {
  loading,
  columns,
  dataList,
  getData,
  pagination,
  loadingConfig,
  onSizeChange,
  onCurrentChange
} = useColumns();

const detailVisible = ref(false);
const dialogTableVisible = ref(false);
const currentRow = ref(-1);
const showDetail = (index: number) => {
  currentRow.value = index;
  detailVisible.value = true;
};

// 表单标题等信息
const CreateOrUpdateForm = reactive({
  formTitle: "添加集群",
  disableNameInput: false,
  submitBtn: "创建"
});

// 创建更新集群-触发打开表单
const handleOpenForm = (
  type: string,
  row: CreateOrUpdateCluster | undefined
) => {
  console.log(type);

  if (type == "update") {
    CreateOrUpdateForm.submitBtn = "更新";
    CreateOrUpdateForm.formTitle = "更新集群";
    CreateOrUpdateForm.disableNameInput = true;
    clusterForm.clusterName = row.clusterName;
    clusterForm.host = row.host;
    clusterForm.bearerToken = row.bearerToken;
    clusterForm.tlsClientConfig.insecure = row.tlsClientConfig.insecure;
    clusterForm.tlsClientConfig.certData = row.tlsClientConfig.certData;
    clusterForm.tlsClientConfig.keyData = row.tlsClientConfig.keyData;
    clusterForm.tlsClientConfig.caData = row.tlsClientConfig.caData;
  } else {
    CreateOrUpdateForm.submitBtn = "创建";
    CreateOrUpdateForm.formTitle = "添加集群";
    CreateOrUpdateForm.disableNameInput = false;
    clusterForm = reactive<CreateOrUpdateCluster>({
      clusterName: "",
      host: "",
      bearerToken: "",
      tlsClientConfig: {
        insecure: false,
        certData: "",
        keyData: "",
        caData: ""
      }
    });
  }
  dialogTableVisible.value = true;
};
// 表单引用
const clusterFormRef = ref<FormInstance>();
// 表单值
let clusterForm = reactive<CreateOrUpdateCluster>({
  clusterName: "",
  host: "",
  bearerToken: "",
  tlsClientConfig: {
    insecure: false,
    certData: "",
    keyData: "",
    caData: ""
  }
});

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  console.log(clusterForm);
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      if (CreateOrUpdateForm.submitBtn === "更新") {
        updateCluster(clusterForm).then(success => {
          if (success.status === "success") {
            dialogTableVisible.value = false;
            message("更新成功", { type: "success" });
            getData(true);
          }
        });
      } else {
        createCluster(clusterForm).then(success => {
          if (success.status === "success") {
            dialogTableVisible.value = false;
            message("创建成功", { type: "success" });
            getData(true);
          }
        });
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  console.log(clusterForm);
};

// 只允许通过取消关闭表单, 其他方式无法关闭
const diglogBeforeClose = (done: (cancel?: boolean) => void) => {
  done(false); // 暂未启用
};

// 删除集群
const handleDeleteCluster = (row: CreateOrUpdateCluster) => {
  if (!row.clusterName) return;
  deleteCluster(row.clusterName).then(success => {
    if (success.status === "success") {
      dataList.value.forEach((item, index) => {
        if (row.clusterName == item.clusterName) {
          dataList.value.splice(index, 1);
        }
      });
      message(success.msg, { type: "success" });
    }
  });
};
</script>

<template>
  <div>
    <el-dialog
      v-if="dialogTableVisible"
      v-model="dialogTableVisible"
      :title="CreateOrUpdateForm.formTitle"
      :close-on-press-escape="true"
      :show-close="true"
      :before-close="diglogBeforeClose"
      :draggable="true"
      label-position="top"
    >
      <el-form
        ref="clusterFormRef"
        :model="clusterForm"
        :rules="rules"
        label-width="140px"
        size="default"
        status-icon
      >
        <el-form-item label="集群名称" prop="clusterName">
          <el-input
            v-model="clusterForm.clusterName"
            :disabled="CreateOrUpdateForm.disableNameInput"
          />
        </el-form-item>
        <el-form-item label="APIServer 地址" prop="host">
          <el-input v-model="clusterForm.host" placeholder="https://" />
        </el-form-item>
        <el-form-item label="BearerToken" prop="bearerToken">
          <el-input
            v-model="clusterForm.bearerToken"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="BearerToken和客户端证书二选一即可"
          />
        </el-form-item>
        <el-form-item label="客户端证书" prop="tlsClientConfig.certData">
          <el-input
            v-model="clusterForm.tlsClientConfig.certData"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 10 }"
            placeholder="PEM格式"
          />
        </el-form-item>
        <el-form-item label="客户端私钥" prop="tlsClientConfig.keyData">
          <el-input
            v-model="clusterForm.tlsClientConfig.keyData"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 10 }"
            placeholder="PEM格式"
          />
        </el-form-item>
        <el-form-item label="不安全集群" prop="tlsClientConfig.insecure">
          <el-switch
            @click="clusterForm.tlsClientConfig.caData = ''"
            v-model="clusterForm.tlsClientConfig.insecure"
          />
        </el-form-item>
        <el-form-item
          v-if="!clusterForm.tlsClientConfig.insecure"
          label="CA证书"
          prop="tlsClientConfig.caData"
        >
          <el-input
            v-model="clusterForm.tlsClientConfig.caData"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 10 }"
            placeholder="PEM格式"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="danger" @click="dialogTableVisible = false">
            取消
          </el-button>
          <el-button @click="resetForm(clusterFormRef)"> 重置 </el-button>
          <el-button type="primary" @click="submitForm(clusterFormRef)">
            {{ CreateOrUpdateForm.submitBtn }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-drawer
      v-model="detailVisible"
      title="集群详情"
      direction="rtl"
      size="35%"
    >
      <el-descriptions
        title="状态信息"
        direction="vertical"
        :column="4"
        size="default"
        border
      >
        <el-descriptions-item label="集群名称" :span="6">{{
          dataList[currentRow].clusterName
        }}</el-descriptions-item>
        <el-descriptions-item label="API Server地址" :span="6">{{
          dataList[currentRow].host
        }}</el-descriptions-item>
        <el-descriptions-item label="集群版本" :span="2">
          <template v-if="dataList[currentRow].version != ''">
            <el-tag size="small" effect="dark">{{
              dataList[currentRow].version
            }}</el-tag>
          </template>
          <template v-else>
            {{ dataList[currentRow].version }}
          </template>
        </el-descriptions-item>
        <el-descriptions-item label="节点数量" :span="2"
          >{{ dataList[currentRow].nodeNum }}
        </el-descriptions-item>
        <el-descriptions-item label="不安全模式" :span="2"
          >{{ dataList[currentRow].tlsClientConfig.insecure ? "是" : "否" }}
        </el-descriptions-item>
        <el-descriptions-item label="集群状态" :span="6">
          <template v-if="dataList[currentRow].status === '运行中'">
            <el-tag type="success" effect="dark" size="small">
              {{ dataList[currentRow].status }}</el-tag
            >
          </template>
          <template v-else>
            {{ dataList[currentRow].status }}
          </template>
        </el-descriptions-item>
      </el-descriptions>
    </el-drawer>
    <PureTableBar title="集群列表" @refresh="getData(true)">
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="handleOpenForm('create', undefined)"
        >
          添加集群
        </el-button>
      </template>
      <template v-slot="{ size, checkList }">
        <pure-table
          border
          row-key="id"
          alignWhole="left"
          table-layout="fixed"
          :checkList="checkList"
          :default-sort="{ prop: 'clusterName', order: 'ascending' }"
          :size="size"
          :loading="loading"
          :loading-config="loadingConfig"
          :data="
            dataList.slice(
              (pagination.currentPage - 1) * pagination.pageSize,
              pagination.currentPage * pagination.pageSize
            )
          "
          :columns="columns"
          @page-size-change="onSizeChange"
          @page-current-change="onCurrentChange"
        >
          <template #operation="{ row, index }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(Detail)"
              @click="showDetail(index)"
            >
              详情
            </el-button>
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="handleOpenForm('update', row)"
            >
              修改
            </el-button>
            <el-popconfirm
              @confirm="handleDeleteCluster(row)"
              confirm-button-type="danger"
              title="是否确认删除?"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="danger"
                  :size="size"
                  :icon="useRenderIcon(Delete)"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
        <br />
      </template>
    </PureTableBar>
  </div>
</template>

<style scoped></style>
