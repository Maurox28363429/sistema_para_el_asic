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
              Consultas
            </h4>
            <form id="formdata">
              <div class="row" style="padding: 1em">
                <q-select
                  v-model="consultorio"
                  :options="consultorios"
                  label="Consultorios"
                  class="col-12 col-md-6"
                  style="padding: 1em"
                />
                <q-select
                  v-model="selectPaciente"
                  :options="optionsPacientes"
                  label="Pacientes"
                  class="col-12 col-md-6"
                  style="padding: 1em"
                />
              </div>
              <q-editor v-model="diagnostico" />
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

const diagnostico = ref("");
const consultorio = ref("");
const selectPaciente = ref("");
//listados
const consultorios = ref([]);
const optionsPacientes = ref([]);

const edit = ref(false);
const user_id = ref("");
//const files = ref([]);
const registerUser = async () => {
  if (edit.value == false) {
    const { error } = await supabase
      .from("consultas_medicas")
      .insert([
        {
          diagnostico: diagnostico.value,
          consultorio_id: consultorio.value.value,
          paciente_id: selectPaciente.value.value,
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
        message: "Consulta registrado con exito",
        color: "green",
        position: "top",
        icon: "check",
      });
    }
  } else {
    const { error } = await supabase
      .from("consultas_medicas")
      .update({
        diagnostico: diagnostico.value,
        consultorio_id: consultorio.value.value,
        paciente_id: selectPaciente.value.value,
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
        message: "Consultorio actualizado con exito",
        color: "green",
        position: "top",
        icon: "check",
      });
    }
  }
};

onMounted(async () => {
  await part1();
  await part2();
  await part3();
});
const part2 = async () => {
  const { data, error } = await supabase.from("consultorios").select("*");
  if (error) {
    Notify.create({
      message: error.message,
      color: "red",
      position: "top",
      icon: "report_problem",
    });
  } else {
    consultorios.value = data.map((item) => {
      return {
        label: item.nombre,
        value: item.id,
      };
    });
  }
};
const part3 = async () => {
  const { data, error } = await supabase.from("pacientes").select("*");
  if (error) {
    Notify.create({
      message: error.message,
      color: "red",
      position: "top",
      icon: "report_problem",
    });
  } else {
    optionsPacientes.value = data.map((item) => {
      return {
        label: item.nombre,
        value: item.id,
      };
    });
  }
};
const part1 = async () => {
  if (localStorage.getItem("consulta_id_edit")) {
    edit.value = true;
    user_id.value = localStorage.getItem("consulta_id_edit");
    localStorage.removeItem("consulta_id_edit");
    const { data, error } = await supabase
      .from("consultas_medicas")
      .select("diagnostico,consultorios(nombre),pacientes(nombre)")
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
      diagnostico.value = data.diagnostico;
      consultorio.value = data.consultorios.nombre;
      selectPaciente.value = data.pacientes.nombre;
    }
  }
};
const cancel = () => {
  document.getElementById("formdata").reset();
};
</script>
