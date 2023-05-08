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
        style="padding: 1em; background: rgba(255, 255, 255, 0.7)"
      >
        <q-card-section>
          <div align="center">
            <q-icon name="calendar"></q-icon>
            <h4>Horarios General de trabajo</h4>
          </div>
          <div class="row justify-center">
            <div class="col-12 col-sm-6">
              <q-date
                title="Mes"
                subtitle="Año"
                v-model="days"
                range
                multiple
                style="width: 100%"
                :events="events"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            color="primary"
            label="Guardar"
            icon="save"
            @click="
              saveDays();
              saveEvent();
            "
            :loading="loading"
          />
          <q-btn
            color="green"
            label="Auto Asignar"
            icon="auto_fix_high"
            @click="autoAsignar()"
            :loading="loading"
          />
        </q-card-actions>
      </q-card>
    </section>
    <q-page-sticky
      position="bottom-right"
      style="margin-right: 2em; margin-bottom: 2em"
    >
      <q-fab icon="list" direction="up" color="accent">
        <q-fab-action color="green" icon="add" />
        <q-fab-action color="blue" icon="search" />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import supabase from "src/supabase";
import { date, Notify } from "quasar";
import { useRouter } from "vue-router";
const router = useRouter();

const days = ref([]);
const events = ref([]);
const loading = ref(false);
onMounted(() => {
  getDays();
  getEvents();
});
function getWeekendDatesForMonth(year, month) {
  var weekendDates = [];
  var startDate = new Date(year, month, 1);
  var endDate = new Date(year, month + 1, 0);
  for (
    var date = startDate;
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    if (date.getDay() == 0 || date.getDay() == 6) {
      // 0 = Sunday, 6 = Saturday
      weekendDates.push(new Date(date));
    }
  }
  return weekendDates;
}
function trabajarDias(year, month) {
  var weekendDates = [];
  var startDate = new Date(year, month, 1);
  var endDate = new Date(year, month + 1, 0);
  for (
    var date = startDate;
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    if (date.getDay() >= 1 && date.getDay() <= 5) {
      // 0 = Sunday, 6 = Saturday
      weekendDates.push(new Date(date));
    }
  }
  return weekendDates;
}
const getDays = async () => {
  const { data, error } = await supabase.from("horario").select("*");
  if (error) {
    Notify.create({
      message: "Error al obtener los dias",
      color: "red",
      icon: "error",
    });
  } else {
    days.value = data[0].json_horario;
    //events.value = data[0].json_horario;
  }
};
const getEvents = async () => {
  const { data, error } = await supabase.from("eventos").select("*");
  if (error) {
    Notify.create({
      message: "Error al obtener los dias",
      color: "red",
      icon: "error",
    });
  } else {
    events.value = data[0].json;
  }
};
const saveDays = async () => {
  const { data, error } = await supabase
    .from("horario")
    .update({ json_horario: days.value })
    .eq("id", 4);
  if (error) {
    Notify.create({
      message: "Error al guardar los dias",
      color: "red",
      icon: "error",
    });
  } else {
    Notify.create({
      message: "Dias guardados correctamente",
      color: "green",
      icon: "done",
    });
  }
};
const saveEvent = async () => {
  const { data, error } = await supabase
    .from("eventos")
    .update({ json: events.value })
    .eq("id", 2);
  if (error) {
    Notify.create({
      message: "Error al guardar los eventos",
      color: "red",
      icon: "error",
    });
  } else {
    Notify.create({
      message: "Eventos guardados correctamente",
      color: "green",
      icon: "done",
    });
  }
};
const autoAsignar = () => {
  console.log(events.value);
  let fechaActual = new Date();
  let añoActual = fechaActual.getFullYear();
  let mesActual = fechaActual.getMonth(); // añadir 1 porque getMonth() devuelve valores del 0 al 11
  let dias = getWeekendDatesForMonth(añoActual, mesActual);
  let datos = dias.map((dia) => {
    return date.formatDate(dia, "YYYY/MM/DD");
  });
  console.log(datos);
  events.value = datos;

  let diasTrabajo = trabajarDias(añoActual, mesActual);
  let datosTrabajo = diasTrabajo.map((dia) => {
    return date.formatDate(dia, "YYYY/MM/DD");
  });
  //console.log(datosTrabajo);
  days.value = datosTrabajo;
};
</script>
