<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <q-icon
            @click="router.go(-1)"
            name="arrow_back"
            size="md"
            color="white"
            class="cursor-pointer"
          />
          Volver
        </q-toolbar-title>

        <div style="font-size: 2em; font-weight: bold">ASIC App</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Acciones </q-item-label>
        <ul class="lista_menu">
          <li v-for="(link, index) of essentialLinks" :key="index">
            <router-link :to="link.link">
              <q-icon size="md" :name="link.icon" />
              {{ link.title }}
            </router-link>
          </li>

          <li @click="logout()">
            <q-icon size="md" name="logout" />
            Salir
          </li>
        </ul>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<style scoped>
.lista_menu {
  list-style: none;
  padding: 1em;
  margin: 0;
}
.lista_menu * {
  color: black;
  text-decoration: none !important;
}
.lista_menu li {
  padding: 0.5em;
  border-radius: 0.5em;
  margin: 0.5em 0;
  cursor: pointer;
}
.lista_menu li:hover {
  background: #eee;
}
</style>
<script setup>
import { ref } from "vue";
import { logoutLocal, userLocal } from "../composables/localStorage";
import { useRouter } from "vue-router";
const router = useRouter();

var essentialLinks = [
  {
    title: "Personal",
    caption: "Administrar usuarios y roles",
    icon: "groups",
    link: "usuarios",
  },
  {
    title: "Documentos",
    caption: "Administrar y generar documentos",
    icon: "menu_book",
    link: "documentos",
  },
  {
    title: "Horario laboral",
    caption: "Administrar permisos, horarios y turnos",
    icon: "calendar_month",
    link: "horarios",
  },
];
const abrir = (link) => {
  router.push(link);
};
const logout = () => {
  logoutLocal();
  window.location.href = "/login";
};
const user = ref(userLocal());
const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>
