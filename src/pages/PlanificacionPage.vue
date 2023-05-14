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
    <section>
      <div class="q-pa-md" style="min-width: 500px">
        <q-date
          v-model="date"
          :events="events.map((item) => item.fecha)"
          event-color="orange"
          style="width: 100%"
        />
      </div>
      <q-card style="background: white">
        <q-card-section>
          Fecha seleccionada: {{ selectEvent.fecha }}
          <div v-show="user.role_id == 1">
            <q-editor
              v-model="selectEvent.text"
              :definitions="{
                bold: { label: 'Bold', icon: null, tip: 'My bold tooltip' },
              }"
              :toolbar="[['bold', 'italic', 'strike', 'underline'], ['save']]"
            >
            </q-editor>
            <div style="margin-top: 2em">
              <q-btn
                label="Guardar"
                @click="guardar()"
                style="width: 100%"
                color="primary"
              />
            </div>
          </div>
          <div v-show="user.role_id != 1">
            <span v-html="selectEvent.text"></span>
          </div>
        </q-card-section>
      </q-card>
    </section>
  </q-page>
</template>

<script setup>
import supabase from "src/supabase";
import { ref, watch, onMounted } from "vue";
import { logoutLocal, userLocal } from "../composables/localStorage";
import { Notify } from "quasar";
const user = ref(userLocal());
const splitterModel = ref(50);
const getDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};
const date = ref("");
const selectEvent = ref({
  fecha: "",
  text: "",
});
watch(date, () => {
  console.log(events.value);
  selectEvent.value = events.value.find(
    (item) => item.fecha === date.value
  ) || {
    fecha: date.value,
    text: "",
  };
});
const events = ref([]);
const guardar = async () => {
  const index = events.value.findIndex(
    (item) => item.fecha === selectEvent.value.fecha
  );
  if (index > -1) {
    events.value[index] = selectEvent.value;
    console.log("as");
  } else {
    events.value.push(selectEvent.value);
  }
  const { data, error } = await supabase
    .from("calendario")
    .update({ json: events.value })
    .eq("id", 1);
  if (error) {
    Notify.create({
      message: "Error al guardar",
      color: "negative",
      icon: "warning",
    });
  } else {
    Notify.create({
      message: "Guardado correctamente",
      color: "positive",
      icon: "check",
    });
  }
};
const recargar = async () => {
  const { data, error } = await supabase
    .from("calendario")
    .select("*")
    .eq("id", 1);
  if (error) {
    console.log(error);
  } else {
    events.value = data[0].json;
  }
};
onMounted(() => {
  recargar();
});

const calendario = supabase
  .channel("custom-update-channel")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "calendario" },
    (payload) => {
      recargar();
    }
  )
  .subscribe();
</script>
