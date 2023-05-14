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
                v-model="nombre"
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
              <q-input
                v-model="fecha_vencimiento"
                label="Fecha de Vencimiento"
                outlined
                class="col-12"
                style="margin-bottom: 1em"
                type="date"
              />
              <q-btn
                @click="registerUser"
                :label="edit ? 'Editar' : 'Registrar'"
                color="green"
                class="col-12"
                style="margin: 1em"
              />
              <q-btn
                to="inventario"
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
const lote = ref("");
const stock = ref("");
const codigo = ref("");
const fecha_vencimiento = ref("");
const edit = ref(false);
const user_id = ref("");
//const files = ref([]);
const registerUser = async () => {
  if (edit.value == false) {
    const { error } = await supabase
      .from("productos")
      .insert([
        {
          name: nombre.value,
          lote: lote.value,
          stock: stock.value,
          codigo: codigo.value,
          fecha_vencimiento: fecha_vencimiento.value,
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
        message: "Producto registrado con exito",
        color: "green",
        position: "top",
        icon: "check",
      });
    }
  } else {
    const { error } = await supabase
      .from("productos")
      .update({
        name: nombre.value,
        lote: lote.value,
        stock: stock.value,
        codigo: codigo.value,
        fecha_vencimiento: fecha_vencimiento.value,
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
        message: "Producto actualizado con exito",
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
      .from("productos")
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
      nombre.value = data.name;
      lote.value = data.lote;
      stock.value = data.stock;
      codigo.value = data.codigo;
      fecha_vencimiento.value = data.fecha_vencimiento;
    }
  }
});
</script>
