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
    children: [
      { path: "", component: () => import("pages/PlanificacionPage.vue") },
    ],
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
      {
        path: "",
        props: true,
        component: () => import("pages/RegisterUserPage.vue"),
      },
    ],
  },
  {
    path: "/consultorios",
    name: "consultorios",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        props: true,
        component: () => import("pages/ConsultoriosPage.vue"),
      },
    ],
  },
  {
    path: "/consultas",
    name: "consultas",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        props: true,
        component: () => import("pages/ConsultasMedicasPage.vue"),
      },
    ],
  },
  {
    path: "/historias",
    name: "historias",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        props: true,
        component: () => import("pages/historiasPage.vue"),
      },
    ],
  },
  {
    path: "/register_consulta",
    name: "register_consulta",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        props: true,
        component: () => import("pages/RegisterConsultaPage.vue"),
      },
    ],
  },
  {
    path: "/pacientes",
    name: "pacientes",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        props: true,
        component: () => import("pages/PacientesPage.vue"),
      },
    ],
  },
  {
    path: "/register_paciente",
    name: "register_paciente",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        props: true,
        component: () => import("pages/RegisterPacientePage.vue"),
      },
    ],
  },
  {
    path: "/register_producto",
    name: "register_producto",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        props: true,
        component: () => import("pages/RegisterInventarioPage.vue"),
      },
    ],
  },
  {
    path: "/inventario",
    name: "inventario",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        props: true,
        component: () => import("pages/InventarioPage.vue"),
      },
    ],
  },
  {
    path: "/register_consultorio",
    name: "register_consultorio",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        props: true,
        component: () => import("pages/RegisterConsultorioPage.vue"),
      },
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
