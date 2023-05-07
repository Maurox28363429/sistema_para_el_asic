<template>
  <q-page
    class="flex flex-center"
    style="
      width: 100vw;
      height: 100vh;
      background: radial-gradient(
        circle,
        rgba(212, 211, 230, 1) 0%,
        rgba(181, 181, 181, 1) 100%
      );
      background: rgb(212, 211, 230);
    "
  >
    <section style="width: 80%; height: 80%">
      <q-card
        bordered
        style="padding: 1em; background: rgba(255, 255, 255, 0.8)"
      >
        <q-card-section>
          <div align="center">
            <q-icon name="user"></q-icon>
            <h4>Usuarios</h4>
          </div>
        </q-card-section>

        <q-separator dark inset />

        <q-card-section>
          <table style="width: 100%; margin: auto; text-align: center">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Cedula</th>
                <th>RIF</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) of users" :key="index">
                <td>{{ user.nombre }}</td>
                <td>{{ user.apellido }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.cedula }}</td>
                <td>{{ user.rif }}</td>
                <td>
                  <span v-if="user.role_id == 1">Administrador</span>
                  <span v-if="user.role_id == 2">Trabajador</span>
                  <span v-if="user.role_id == 3">Paciente</span>
                  <span v-if="user.role_id == 4">Obreros</span>
                  <span v-if="user.role_id == 5">Profesional de la salud</span>
                </td>
                <td>
                  <q-btn
                    @click="editUser(user)"
                    class="glossy"
                    rounded
                    color="primary"
                    style="margin: 1em 0.5em"
                    label="Editar"
                  />
                  <q-btn
                    @click="deleteUser(user.id)"
                    class="glossy"
                    rounded
                    color="red"
                    style="margin: 1em 0.5em"
                    label="Borrar"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <q-pagination
            style="margin-top: 1em"
            v-model="paginate.currentPage"
            color="teal"
            :max="paginate.totalPages"
            :ellipses="false"
            :boundary-numbers="false"
          />
        </q-card-section>
      </q-card>
    </section>
    <q-page-sticky
      position="bottom-right"
      style="margin-right: 2em; margin-bottom: 2em"
    >
      <q-fab icon="list" direction="up" color="accent">
        <q-fab-action color="green" icon="add" to="register_user" />
        <q-fab-action color="primary" icon="search" @click="search()" />
        <q-fab-action color="red" icon="restart_alt" @click="refresh()" />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import supabase from "src/supabase";
import { Notify } from "quasar";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const router = useRouter();
const $q = useQuasar();
const paginate = ref({
  currentPage: 1,
  perPage: 10,
  totalPages: 10,
});

const users = ref([]);
watch(paginate.value, async (val) => {
  console.log(val.currentPage);
  await getData();
});
onMounted(async () => {
  //counter usuarios
  const { data: count_user, error } = await supabase
    .from("Usuarios")
    .select("count", { count: "exact" });
  if (error) {
    Notify.create({
      message: "Compruebe su conexión a internet",
      color: "red",
      icon: "report_problem",
    });
  } else {
    paginate.value.totalPages = count_user[0].count / paginate.value.perPage;
  }
  await getData();
});
const search_item = ref(null);
const getData = async () => {
  if (search_item.value != null) {
    var { data, error } = await supabase
      .from("Usuarios")
      .select("*")
      .like("cedula", "%" + search_item.value + "%")
      .range(
        paginate.value.perPage * (paginate.value.currentPage - 1),
        paginate.value.perPage * paginate.value.currentPage
      );
  } else {
    var { data, error } = await supabase
      .from("Usuarios")
      .select("*")
      .range(
        paginate.value.perPage * (paginate.value.currentPage - 1),
        paginate.value.perPage * paginate.value.currentPage
      );
  }
  if (error) {
    Notify.create({
      message: "Compruebe su conexión a internet",
      color: "red",
      icon: "report_problem",
    });
  } else {
    users.value = data;
    Notify.create({
      message: "Datos cargados correctamente",
      color: "green",
      icon: "check",
    });
  }
};
const refresh = async () => {
  search_item.value = null;
  await getData();
};
const search = () => {
  $q.dialog({
    title: "Buscar",
    message: "Coloque la cedula del usuario",
    prompt: {
      model: "",
      type: "text", // optional
    },
    cancel: true,
    persistent: true,
  })
    .onOk(async (data) => {
      search_item.value = data;
      await getData();
    })
    .onCancel(() => {
      console.log(">>>> Cancel");
    })
    .onDismiss(() => {
      console.log("I am triggered on both OK and Cancel");
    });
};
const deleteUser = (id) => {
  $q.dialog({
    title: "Confirmación",
    message: "Desea borrar el usuario seleccionado",
    cancel: true,
    persistent: true,
  })
    .onOk(async () => {
      const { error } = await supabase.from("Usuarios").delete().eq("id", id);
      if (error) {
        Notify.create({
          message: "Compruebe su conexión a internet",
          color: "red",
          icon: "report_problem",
        });
      } else {
        Notify.create({
          message: "Usuario borrado correctamente",
          color: "green",
          icon: "check",
        });
        await getData();
      }
    })
    .onOk(() => {
      // console.log('>>>> second OK catcher')
    })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
};
</script>
