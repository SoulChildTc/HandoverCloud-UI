import { delay } from "@pureadmin/utils";
import { ref, onMounted, reactive } from "vue";
import type { PaginationProps, LoadingConfig } from "@pureadmin/table";
import { getClusterList, ClusterList } from "@/api/k8s/cluster";
import { ResponseBase } from "@/api/base";

export function useColumns() {
  const dataList = ref([]);
  const loading = ref(true);
  const columns: TableColumnList = [
    {
      type: "selection",
      width: 55,
      align: "left",
      hide: ({ checkList }) => !checkList.includes("勾选列")
    },
    {
      label: "序号",
      type: "index",
      width: 70,
      hide: ({ checkList }) => !checkList.includes("序号列")
    },
    {
      label: "集群名称",
      prop: "clusterName",
      sortable: true
    },
    {
      label: "集群版本",
      prop: "version"
    },
    {
      label: "运行状态",
      prop: "status",
      cellRenderer: ({ row, props }) => {
        if (row.status === "运行中") {
          return (
            <el-tag size={props.size} type="success" effect="dark">
              运行中
            </el-tag>
          );
        } else {
          return (
            <el-tooltip content={row.status} placement="bottom">
              <el-tag size={props.size} type="danger" effect="dark">
                状态异常
              </el-tag>
            </el-tooltip>
          );
        }
      },
      filters: [
        { text: "运行中", value: "running" },
        { text: "状态异常", value: "error" }
      ],
      filterMethod: (value, row) => {
        if (value === "running" && row.status === "运行中") {
          return true;
        }
        if (value === "error" && row.status != "运行中") {
          return true;
        }
        return false;
      },
      filterMultiple: false,
      showOverflowTooltip: false
    },
    {
      label: "节点数量",
      prop: "nodeNum",
      sortable: true
    },
    {
      label: "操作",
      width: "250",
      fixed: "right",
      prop: "operation",
      slot: "operation"
    }
  ];

  /** 分页配置 */
  const pagination = reactive<PaginationProps>({
    pageSize: 10,
    currentPage: 1,
    pageSizes: [10, 15, 20],
    total: 0,
    align: "center",
    background: true,
    small: false
  });

  /** 加载动画配置 */
  const loadingConfig = reactive<LoadingConfig>({
    text: "正在加载第一页...",
    viewBox: "-10, -10, 50, 50",
    spinner: `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `
    // svg: "",
    // background: rgba()
  });

  function onSizeChange(val) {
    console.log("onSizeChange", val);
  }

  function onCurrentChange(val) {
    loadingConfig.text = `正在加载第${val}页...`;
    loading.value = true;
    delay(600).then(() => {
      loading.value = false;
    });
  }

  async function getData(force = false) {
    loading.value = true;
    getClusterList(force)
      .then((success: ResponseBase<ClusterList[]>) => {
        dataList.value = success.data;
        pagination.total = dataList.value.length;
        loading.value = false;
      })
      .catch((err: ResponseBase<ClusterList[]>) => {
        console.log(err);
      });
  }

  onMounted(async () => {
    getData();
  });

  return {
    loading,
    columns,
    dataList,
    pagination,
    loadingConfig,
    getData,
    onSizeChange,
    onCurrentChange
  };
}
