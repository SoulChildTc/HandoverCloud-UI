const Layout = () => import("@/layout/index.vue");

export default {
  path: "/application",
  name: "application",
  component: Layout,
  redirect: "/application/list",
  meta: {
    icon: "ri:apps-2-line",
    title: "应用管理",
    rank: 0
  },
  children: [
    {
      path: "/application/list",
      name: "application-list",
      component: () => import("@/views/application/index.vue"),
      meta: {
        icon: "ri:box-3-line",
        title: "应用列表",
        roles: ["admin"],
        showParent: true
      }
    }
  ]
} as RouteConfigsTable;
