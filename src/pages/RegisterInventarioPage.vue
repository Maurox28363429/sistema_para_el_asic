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
              Insumo
            </h4>
            <form id="formdata">
              <q-input
                v-model="name"
                label="Nombre"
                outlined
                class="col-12"
                style="margin-bottom: 1em"
              />
              <q-input
                v-model="lote"
                label="Lote"
                outlined
                class="col-12"
                style="margin-bottom: 1em"
              />
              <q-input
                v-model="stock"
                label="Cantidad"
                outlined
                class="col-12"
                style="margin-bottom: 1em"
              />
              <q-input
                v-model="codigo"
                label="Codigo"
                outlined
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

const nombre = ref("");
const direccion = ref("");

const edit = ref(false);
const user_id = ref("");
//const files = ref([]);
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
      .from("consultorios")
      .insert([
        {
          nombre: nombre.value,
          direccion: direccion.value,
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
        message: "Consultorio registrado con exito",
        color: "green",
        position: "top",
        icon: "check",
      });
    }
  } else {
    const { error } = await supabase
      .from("consultorios")
      .update({
        nombre: nombre.value,
        direccion: direccion.value,
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
  if (localStorage.getItem("producto_id_edit")) {
    edit.value = true;
    user_id.value = localStorage.getItem("producto_id_edit");
    localStorage.removeItem("producto_id_edit");
    const { data, error } = await supabase
      .from("consultorios")
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
      direccion.value = data.direccion;
    }
  }
});
const cancel = () => {
  document.getElementById("formdata").reset();
};
</script>
