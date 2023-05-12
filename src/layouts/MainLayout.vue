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

        <div style="font-size: 2em; font-weight: bold">
          ASIC App

          <q-btn :color="noti_color" label="" icon="notifications">
            <q-menu>
              <q-list style="min-width: 200px">
                <q-item
                  clickable
                  v-close-popup
                  v-for="notis in notify"
                  :key="notis.id"
                  @click="view_more(notis)"
                >
                  <q-item-section>
                    <q-item-label>
                      <q-icon name="notifications" color="green" />
                      {{ notis.title }}
                    </q-item-label>
                    <q-item-label caption>
                      {{ notis.descripcion.substring(0, 40) }}
                      {{ notis.descripcion.length > 40 ? "..." : "" }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="borrar_notis()">
                  <q-item-section>
                    <q-item-label>
                      <q-icon name="delete" color="red" />
                      Vaciar
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Acciones </q-item-label>
        <ul class="lista_menu">
          <router-link
            v-for="(link, index) of essentialLinks"
            :key="index"
            :to="link.link"
          >
            <li>
              <q-icon size="md" :name="link.icon" />
              {{ link.title }}
            </li>
          </router-link>

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
import { ref, onMounted } from "vue";
import { logoutLocal, userLocal } from "../composables/localStorage";
import { useRouter } from "vue-router";
import supabase from "src/supabase";
import { Notify } from "quasar";
import { useQuasar } from "quasar";
const $q = useQuasar();

const router = useRouter();
var essentialLinks = [
  {
    title: "Inicio",
    caption: "Volver a la página de inicio",
    icon: "home",
    link: "home",
  },
  {
    title: "Personal",
    caption: "Administrar usuarios y roles",
    icon: "groups",
    link: "usuarios",
  },
  {
    title: "Pacientes",
    caption: "Administrar pacientes",
    icon: "assist_walker",
    link: "pacientes",
  },
  {
    title: "Inventario",
    caption: "Administrar inventario",
    icon: "inventory",
    link: "inventario",
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
  {
    title: "Consultorios",
    caption: "Administrar consultorios",
    icon: "meeting_room",
    link: "consultorios",
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
const notifiy = supabase
  .channel("custom-all-channel")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "notifiy" },
    (payload) => {
      console.log("Change received!", payload);
      if (payload.new.user_id == user.value.id) {
        get_notify();
        $q.dialog({
          timeout: 5000,
          dark: true,
          message: payload.new.descripcion,
          title: payload.new.title,
          icon: "notifications",
        })
          .onOk(async () => {
            await supabase
              .from("notifiy")
              .delete()
              .match({ id: payload.new.id });
          })
          .onCancel(() => {
            // console.log('Cancel')
          })
          .onDismiss(() => {
            // console.log('I am triggered on both OK and Cancel')
          });
      }
    }
  )
  .subscribe();

const notify = ref([]);
const noti_color = ref("primary");
const get_notify = async () => {
  const { data, error } = await supabase
    .from("notifiy")
    .select("*")
    .order("created_at", { ascending: false })
    .eq("user_id", user.value.id)
    .limit(5);
  if (error) {
    console.log(error);
  } else {
    notify.value = data;
    if (data.length > 0) {
      noti_color.value = "green";
    } else {
      noti_color.value = "primary";
    }
  }
};
onMounted(() => {
  get_notify();
});
const borrar_notis = async () => {
  await supabase.from("notifiy").delete().match({ user_id: user.value.id });
  get_notify();
};
const view_more = (notis) => {
  $q.dialog({
    title: notis.title,
    message: notis.descripcion,
    html: true,
    ok: "Cerrar",
  });
};
</script>
