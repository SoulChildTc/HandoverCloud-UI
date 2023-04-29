const Layout = () => import("@/layout/index.vue");

export default {
  path: "/cluster",
  name: "cluster",
  component: Layout,
  redirect: "/list",
  meta: {
    icon: "ri:cloud-windy-line",
    title: "集群管理",
    rank: 0
  },
  children: [
    {
      path: "/list",
      name: "list",
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
