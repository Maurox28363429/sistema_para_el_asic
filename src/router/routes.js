const routes = [
  {
    path: "/",
    component: () => import("layouts/DemoLayout.vue"),
    children: [{ path: "", component: () => import("pages/IndexPage.vue") }],
  },
  {
    path: "/login",
    component: () => import("layouts/DemoLayout.vue"),
    children: [{ path: "", component: () => import("pages/IndexPage.vue") }],
  },
  {
    path: "/home",
    name: "home",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/HomePage.vue") }],
  },
  {
    path: "/usuarios",
    name: "usuarios",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/UsuariosPage.vue") }],
  },
  {
    path: "/documentos",
    name: "documentos",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/DocumentosPage.vue") },
    ],
  },
  {
    path: "/horarios",
    name: "horarios",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/HorariosPage.vue") }],
  },
  {
    path: "/horarios",
    name: "horarios",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/HorariosPage.vue") }],
  },
  {
    path: "/register_user",
    name: "register_user",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/RegisterUserPage.vue") },
    ],
  },
  {
    path: "/editar_user",
    name: "editar_user",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/EditarUserPage.vue") },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
