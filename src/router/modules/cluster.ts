const Layout = () => import("@/layout/index.vue");

export default {
  path: "/cluster",
  name: "cluster",
  component: Layout,
  redirect: "/cluster/list",
  meta: {
    icon: "ri:cloud-windy-line",
    title: "集群管理",
    rank: 10
  },
  children: [
    {
      path: "/cluster/list",
      name: "cluster-list",
      component: () => import("@/views/cluster/index.vue"),
      meta: {
        icon: "ri:list-check",
        title: "集群列表",
        showParent: true,
        roles: ["admin"]
      }
    }
  ]
} as RouteConfigsTable;
