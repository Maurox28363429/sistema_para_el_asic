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
    <section style="width: 90%; height: 90%">
      <q-card
        bordered
        style="padding: 1em; background: rgba(255, 255, 255, 0.5)"
      >
        <q-card-section>
          <div align="center">
            <q-icon name="user"></q-icon>
            <h4>
              {{ edit ? "Editar" : "Registrar" }}
              Usuario
            </h4>
            <form id="formdata">
              <q-input
                v-model="nombre"
                label="Nombre"
                outlined
                class="col-12"
                style="margin-bottom: 1em"
              />
              <q-input
                v-model="apellido"
                label="Apellido"
                outlined
                class="col-12"
                style="margin-bottom: 1em"
              />
              <q-input
                v-model="email"
                label="Correo"
                outlined
                class="col-12"
                style="margin-bottom: 1em"
              />
              <q-input
                v-model="cedula"
                label="Cedula"
                outlined
                class="col-12"
                style="margin-bottom: 1em"
              />
              <q-input
                v-model="rif"
                label="RIF"
                outlined
                class="col-12"
                style="margin-bottom: 1em"
              />
              <q-select
                v-model="role_id"
                :options="roles"
                label="Rol"
                outlined
                class="col-12"
                style="margin-bottom: 1em"
                editable
              />
              <q-select
                v-model="consultorio_id"
                :options="consultorios"
                label="Consultorio"
                outlined
                class="col-12"
                style="margin-bottom: 1em"
                editable
              />
              <q-input
                v-model="password"
                label="Contraseña"
                type="password"
                outlined
                class="col-12"
                style="margin-bottom: 1em"
              />
              <!-- <q-file
                label="Subir archivos"
                outlined
                dense
                v-model="files"
                ref="fileInput"
                multiple
              />
              <div style="text-align: left; font-size: 1.5em">
                Archivos subidos: {{ files.length }}
              </div> -->
              <div class="col-12">
                <h4>Datos Todo List</h4>
                <div v-for="(data, index) in todoList" :key="index" class="row">
                  <div class="col-6">
                    <q-input
                      v-model="data.campo"
                      label="Campo"
                      outlined
                      style="margin: 1em"
                    />
                  </div>
                  <div class="col-6">
                    <q-input
                      v-model="data.valor"
                      label="Valor"
                      outlined
                      style="margin: 1em"
                    />
                  </div>
                </div>
                <q-btn
                  @click="addTodoList()"
                  label="Agregar datos"
                  color="blue"
                  icon="add"
                  class="col-12"
                  style="margin: 1em"
                />
              </div>
              <q-btn
                @click="registerUser"
                :label="edit ? 'Editar' : 'Registrar'"
                color="green"
                class="col-12"
                style="margin: 1em"
              />
              <q-btn
                @click="cancel"
                label="Cancelar"
                color="red"
                class="col-12"
                style="margin: 1em"
              />
            </form>
          </div>
        </q-card-section>

        <q-separator dark inset />

        <q-card-section> </q-card-section>
      </q-card>
    </section>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import supabase from "src/supabase";
import { Notify } from "quasar";
import { useRouter } from "vue-router";
const router = useRouter();

const todoList = ref([
  {
    campo: "",
    valor: "",
  },
]);
const addTodoList = () => {
  todoList.value.push({
    campo: "",
    valor: "",
  });
};
const nombre = ref("");
const apellido = ref("");
const email = ref("");
const cedula = ref("");
const rif = ref("");
const role_id = ref("");
const password = ref("");
const edit = ref(false);
const user_id = ref("");
//const files = ref([]);
const roles = [
  { label: "Administrador", value: 1 },
  { label: "Trabajador", value: 2 },
  { label: "Paciente", value: 3 },
  { label: "Obreros", value: 4 },
  { label: "Profesional de la salud", value: 5 },
];
const consultorios = ref([]);
const consultorio_id = ref("");
const json = ref({
  array_files: [],
});
const registerUser = async () => {
  /*   if (files.value.length > 0) {
    for (let i = 0; i < files.value.length; i++) {
      const { data, error2 } = await supabase.storage.createBucket(
        cedula.value
      );
      const { error } = await supabase.storage
        .from(cedula.value)
        .upload(files.value[i].name, files.value[i]);
      if (error) {
        Notify.create({
          message: error.message,
          color: "red",
          position: "top",
          icon: "report_problem",
        });
      } else {
        json.value.array_files.push(
          "https://lyikdkydcxiukrhkrqwz.supabase.co/storage/v1/object/public/" +
            cedula.value +
            "/" +
            files.value[i].name
        );
      }
    }
  } */
  if (edit.value == false) {
    const { error } = await supabase
      .from("Usuarios")
      .insert([
        {
          nombre: nombre.value,
          apellido: apellido.value,
          email: email.value,
          cedula: cedula.value,
          rif: rif.value,
          role_id: role_id.value.value,
          password: password.value,
          consultorio_id: consultorio_id.value.value,
          json_data: todoList.value,
        },
      ])
      .single();
    if (error) {
      Notify.create({
        message: error.message,
        color: "red",
        position: "top",
        icon: "report_problem",
      });
    } else {
      Notify.create({
        message: "Usuario registrado con exito",
        color: "green",
        position: "top",
        icon: "check",
      });
    }
  } else {
    const { error } = await supabase
      .from("Usuarios")
      .update({
        nombre: nombre.value,
        apellido: apellido.value,
        email: email.value,
        cedula: cedula.value,
        rif: rif.value,
        role_id: role_id.value.value,
        password: password.value,
        consultorio_id: consultorio_id.value.value,
        json_data: todoList.value,
      })
      .eq("id", user_id.value);
    if (error) {
      Notify.create({
        message: error.message,
        color: "red",
        position: "top",
        icon: "report_problem",
      });
    } else {
      Notify.create({
        message: "Usuario actualizado con exito",
        color: "green",
        position: "top",
        icon: "check",
      });
    }
  }
};

onMounted(() => {
  init_part1();
  init_part2();
});
const cancel = () => {
  document.getElementById("formdata").reset();
};
const init_part2 = async () => {
  const { data, error } = await supabase
    .from("consultorios")
    .select("*")
    .order("nombre", { ascending: true });
  if (error) {
    Notify.create({
      message: error.message,
      color: "red",
      position: "top",
      icon: "report_problem",
    });
  } else {
    consultorios.value = data.map((item) => {
      return { label: item.nombre, value: item.id };
    });
  }
};
const init_part1 = async () => {
  if (localStorage.getItem("user_id_edit")) {
    edit.value = true;
    user_id.value = localStorage.getItem("user_id_edit");
    localStorage.removeItem("user_id_edit");
    const { data, error } = await supabase
      .from("Usuarios")
      .select(
        "nombre,apellido,email,cedula,rif,password,json_data,consultorios(nombre),roles(name)"
      )
      .eq("id", user_id.value)
      .single();
    if (error) {
      Notify.create({
        message: error.message,
        color: "red",
        position: "top",
        icon: "report_problem",
      });
    } else {
      nombre.value = data.nombre;
      apellido.value = data.apellido;
      email.value = data.email;
      cedula.value = data.cedula;
      rif.value = data.rif;
      role_id.value = data.roles.name;
      password.value = data.password;
      consultorio_id.value = data.consultorios.nombre;
      todoList.value = data.json_data;
    }
  }
};
</script>
