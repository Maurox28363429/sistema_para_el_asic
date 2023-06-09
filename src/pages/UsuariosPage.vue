<template>
  <q-page
    class="flex flex-center"
    style="
      width: 100vw;
      height: 100%;
      background: radial-gradient(
        circle,
        rgba(212, 211, 230, 1) 0%,
        rgba(181, 181, 181, 1) 100%
      );
      background: rgb(212, 211, 230);
    "
  >
    <section
      :style="
        !$q.screen.lt.md
          ? 'width: 95%; height: 95%'
          : 'width: 100%; height: 100%'
      "
    >
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
                <th :class="!$q.screen.lt.md ? '' : 'hide'">Correo</th>
                <th>Cedula</th>
                <th :class="!$q.screen.lt.md ? '' : 'hide'">RIF</th>
                <th>Rol</th>
                <th>Años de servicio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) of users" :key="index">
                <td>{{ user.nombre }} {{ user.apellido }}</td>
                <td :class="!$q.screen.lt.md ? '' : 'hide'">
                  {{ user.email }}
                </td>
                <td>{{ user.cedula }}</td>
                <td :class="!$q.screen.lt.md ? '' : 'hide'">
                  {{ user.rif }}
                </td>
                <td>
                  <span v-if="user.role_id == 1">Administrador</span>
                  <span v-if="user.role_id == 2">Trabajador</span>
                  <span v-if="user.role_id == 3">Paciente</span>
                  <span v-if="user.role_id == 4">Obreros</span>
                  <span v-if="user.role_id == 5">Profesional de la salud</span>
                </td>
                <td>
                  <span v-if="user.fecha_entrada != null">
                    {{ años_de_servicio(user.fecha_entrada) }} años
                  </span>
                  <span v-else>Sin fecha de ingreso</span>
                </td>
                <td>
                  <q-btn
                    class="glossy"
                    rounded
                    color="green"
                    style="margin: 1em 0.5em"
                    :label="$q.screen.lt.md ? '' : 'Formato'"
                    icon="picture_as_pdf"
                  >
                    <q-menu>
                      <q-list style="min-width: 200px">
                        <q-item
                          clickable
                          v-close-popup
                          @click="documentGet(user)"
                        >
                          <q-item-section>Constancia de trabajo</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup>
                          <q-item-section>Documento 2</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup>
                          <q-item-section>Documento 3</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                  <q-btn
                    @click="editUser(user)"
                    class="glossy"
                    rounded
                    color="primary"
                    style="margin: 1em 0.5em"
                    :label="$q.screen.lt.md ? '' : 'Editar'"
                    icon="edit"
                  />
                  <q-btn
                    @click="deleteUser(user.id)"
                    class="glossy"
                    rounded
                    color="red"
                    style="margin: 1em 0.5em"
                    :label="$q.screen.lt.md ? '' : 'Borrar'"
                    icon="delete"
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
        <q-fab-action
          color="green"
          icon="file_download"
          @click="exportData()"
        />
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
import { saveAs } from "file-saver";
import { baseURL } from "src/boot/axios.js";

const router = useRouter();
const $q = useQuasar();
const paginate = ref({
  currentPage: 1,
  perPage: 10,
  totalPages: 10,
});
const users = ref([]);
const consultorios = ref([]);
watch(paginate.value, async (val) => {
  console.log(val.currentPage);
  await getData();
});
onMounted(async () => {
  await counter_paginate();
  await getData();
});
const años_de_servicio = (fecha_ingreso) => {
  if (fecha_ingreso == null) {
    return "Sin fecha de ingreso";
  }
  let fecha_actual = new Date();
  let fecha_ingreso_date = new Date(fecha_ingreso);
  let años = fecha_actual.getFullYear() - fecha_ingreso_date.getFullYear();
  let meses = fecha_actual.getMonth() - fecha_ingreso_date.getMonth();
  let dias = fecha_actual.getDate() - fecha_ingreso_date.getDate();
  if (meses < 0 || (meses === 0 && dias < 0)) {
    años--;
  }
  if (años == 0) {
    return "Menos de un año";
  }
  return años;
};
const counter_paginate = async () => {
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
    paginate.value.totalPages = Math.ceil(
      count_user[0].count / paginate.value.perPage
    );
  }
};
const search_item = ref(null);
const getData = async () => {
  if (search_item.value != null) {
    var { data, error } = await supabase
      .from("Usuarios")
      .select("*,roles(name)")
      .like("cedula", "%" + search_item.value + "%")
      .range(
        paginate.value.perPage * (paginate.value.currentPage - 1),
        paginate.value.perPage * paginate.value.currentPage
      );
  } else {
    var { data, error } = await supabase
      .from("Usuarios")
      .select("*,roles(name)")
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
const editUser = (user) => {
  localStorage.setItem("user_id_edit", user.id);
  router.push("/editar_user");
};
const exportData = async () => {
  const { data, error } = await supabase
    .from("Usuarios")
    .select(
      "id,nombre,apellido,roles(name),cedula,rif,telefono,consultorios(nombre),talla_pantalon,talla_camisa,talla_zapatos,fecha_entrada"
    );

  let data_csv = "";
  let obtener_consultorio = (consultorio) => {
    if (consultorio == null) {
      return "Sin consultorio";
    } else {
      return consultorio.nombre;
    }
  };
  let obtener_rol = (rol) => {
    if (rol == null) {
      return "Sin rol";
    } else {
      return rol.name;
    }
  };
  data_csv +=
    "id,nombre,apellido,rol,cedula,rif,telefono,consultorio,talla de pantalon,talla de camisa,talla de zapatos, fecha de ingreso,años de servicio \n";
  data.forEach((element) => {
    data_csv +=
      element.id +
      "," +
      element.nombre +
      "," +
      element.apellido +
      "," +
      obtener_rol(element.roles) +
      "," +
      element.cedula +
      "," +
      element.rif +
      "," +
      element.telefono +
      "," +
      obtener_consultorio(element.consultorios) +
      "," +
      element.talla_pantalon +
      "," +
      element.talla_camisa +
      "," +
      element.talla_zapatos +
      "," +
      element.fecha_entrada +
      "," +
      años_de_servicio(element.fecha_entrada) +
      "," +
      "\n";
  });

  if (error) {
    Notify.create({
      message: "Compruebe su conexión a internet",
      color: "red",
      icon: "report_problem",
    });
  } else {
    Notify.create({
      message: "Datos exportados correctamente",
      color: "green",
      icon: "check",
    });
    const blob = new Blob([data_csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "data_movimientos.csv");
  }
};
const documentGet = async (user) => {
  window.open(baseURL + "asic_constancia/" + user.id, "_blank");
};
</script>
