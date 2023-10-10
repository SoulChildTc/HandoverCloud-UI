import { reactive, onMounted, ref } from "vue";
import type { PaginationProps, LoadingConfig } from "@pureadmin/table";
import { getDeoloymentList, getDeoloymentPods } from "@/api/k8s/deployment";
import { PageResponse, ResponseBase, PageReq } from "@/api/base";
import { getNamespaceList } from "@/api/k8s/namespace";

export function useData() {
  const dataList = ref([]);
  const loading = ref(true);
  const namespaceList = ref([]);
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
      label: "名称空间",
      prop: "metadata.namespace",
      sortable: false,
      align: "left"
    },
    {
      label: "应用名称",
      prop: "metadata.name",
      sortable: true
    },
    {
      label: "实例数量",
      prop: "spec.replicas"
    },
    // {
    //   label: "运行状态",
    //   prop: "status",
    //   cellRenderer: ({ row, props }) => {
    //     if (row.status === "运行中") {
    //       return (
    //         <el-tag size={props.size} type="success" effect="dark">
    //           运行中
    //         </el-tag>
    //       );
    //     } else {
    //       return (
    //         <el-tooltip content={row.status} placement="bottom">
    //           <el-tag size={props.size} type="danger" effect="dark">
    //             状态异常
    //           </el-tag>
    //         </el-tooltip>
    //       );
    //     }
    //   },
    //   filters: [
    //     { text: "运行中", value: "running" },
    //     { text: "状态异常", value: "error" }
    //   ],
    //   filterMethod: (value, row) => {
    //     if (value === "running" && row.status === "运行中") {
    //       return true;
    //     }
    //     if (value === "error" && row.status != "运行中") {
    //       return true;
    //     }
    //     return false;
    //   },
    //   filterMultiple: false,
    //   showOverflowTooltip: false
    // },
    // {
    //   label: "节点数量",
    //   prop: "nodeNum",
    //   sortable: true
    // },
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
    pagination.pageSize = val;
    onCurrentChange(pagination.currentPage);
  }

  function onCurrentChange(val) {
    loadingConfig.text = `正在加载第${val}页...`;
    loading.value = true;
    getData({
      page: pagination.currentPage,
      limit: pagination.pageSize
      // filter: form.filter,
      // namespace: form.namespace
    })
      .then((success: any[]) => {
        dataList.value = success;
      })
      .finally(() => {
        loading.value = false;
      });
  }

  function onSelectionChange(val) {
    console.log(val);
  }

  async function getData(data: PageReq = {}) {
    loading.value = true;
    return new Promise<any[]>((resolve, reject) => {
      getDeoloymentList(data)
        .then((success: ResponseBase<PageResponse>) => {
          success.data.items.forEach((value, index) => {
            if (value.spec.replicas > 0) {
              success.data.items[index].hasChildren = true;
            }
          });
          pagination.total = success.data.total;
          resolve(success.data.items);
        })
        .catch((err: []) => {
          console.log(err);
          reject([]);
        })
        .finally(() => {
          loading.value = false;
        });
    });
  }

  async function getNamespaceData(data: PageReq = {}) {
    data.page = 1;
    data.limit = 1000;
    getNamespaceList(data).then((success: ResponseBase<PageResponse>) => {
      namespaceList.value = success.data.items;
    });
  }

  async function expand(
    row: any,
    treeNode: unknown,
    resolve: (date: any[]) => void
  ) {
    // loading.value = true;
    getDeoloymentPods({
      namespace: row.metadata.namespace,
      name: row.metadata.name
    })
      .then((success: ResponseBase<PageResponse>) => {
        resolve(success.data.items);
        // loading.value = false;
      })
      .catch((err: ResponseBase<PageResponse>) => {
        console.log(err);
      });
  }

  onMounted(async () => {
    getData({ namespace: "default" }).then(data => {
      dataList.value = data;
    });
    getNamespaceData();
  });

  return {
    loading,
    columns,
    dataList,
    pagination,
    loadingConfig,
    getData,
    getNamespaceData,
    namespaceList,
    expand,
    onSizeChange,
    onCurrentChange,
    onSelectionChange
  };
}
