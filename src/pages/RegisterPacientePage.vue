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
              Paciente
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
                v-model="cedula"
                label="Cedula"
                outlined
                class="col-12"
                style="margin-bottom: 1em"
              />
              <q-input
                v-model="telefono"
                label="Telefono"
                outlined
                class="col-12"
                style="margin-bottom: 1em"
              />
              <q-input
                v-model="fecha_nacimiento"
                label="Fecha de Nacimiento"
                outlined
                type="date"
                class="col-12"
                style="margin-bottom: 1em"
              />
              <q-select
                v-model="sexo"
                :options="sexoOptions"
                label="Sexo"
                outlined
                class="col-12"
                style="margin-bottom: 1em"
              />
              <q-input
                v-model="descripcion"
                label="descripcion"
                outlined
                type="textarea"
                class="col-12"
                style="margin-bottom: 1em"
              />
              <q-btn
                @click="registerUser"
                :label="edit ? 'Editar' : 'Registrar'"
                color="green"
                class="col-12"
                style="margin: 1em"
              />
              <q-btn
                to="pacientes"
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

const nombre = ref("");
const cedula = ref("");
const sexo = ref("");
const edit = ref(false);
const sexoOptions = ref([
  {
    label: "Hombre",
    value: "Hombre",
  },
  {
    label: "Mujer",
    value: "Mujer",
  },
]);
const telefono = ref("");
const fecha_nacimiento = ref("");
const descripcion = ref("");
const user_id = ref("");
const registerUser = async () => {
  if (edit.value == false) {
    const { error } = await supabase
      .from("pacientes")
      .insert([
        {
          nombre: nombre.value,
          cedula: cedula.value,
          sexo: sexo.value.value,
          telefono: telefono.value,
          fecha_nacimiento: fecha_nacimiento.value,
          descripcion: descripcion.value,
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
        message: "Pacientes registrado con exito",
        color: "green",
        position: "top",
        icon: "check",
      });
    }
  } else {
    const { error } = await supabase
      .from("pacientes")
      .update({
        nombre: nombre.value,
        cedula: cedula.value,
        sexo: sexo.value.value,
        telefono: telefono.value,
        fecha_nacimiento: fecha_nacimiento.value,
        descripcion: descripcion.value,
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
        message: "Paciente actualizado con exito",
        color: "green",
        position: "top",
        icon: "check",
      });
    }
  }
};

onMounted(() => {
  init_part1();
});
const cancel = () => {
  document.getElementById("formdata").reset();
};
const init_part1 = async () => {
  if (localStorage.getItem("paciente_id_edit")) {
    edit.value = true;
    user_id.value = localStorage.getItem("paciente_id_edit");
    localStorage.removeItem("paciente_id_edit");
    const { data, error } = await supabase
      .from("pacientes")
      .select("*")
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
      cedula.value = data.cedula;
      sexo.value = data.sexo;
      telefono.value = data.telefono;
      fecha_nacimiento.value = data.fecha_nacimiento;
      descripcion.value = data.descripcion;
    }
  }
};
</script>
