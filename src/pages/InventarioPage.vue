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
          ? 'width: 80%; height: 80%'
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
            <h4>Inventario</h4>
          </div>
        </q-card-section>

        <q-separator dark inset />

        <q-card-section>
          <table style="width: 100%; margin: auto; text-align: center">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Lote</th>
                <th>Cantidad</th>
                <th>Fecha de vencimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) of users" :key="index">
                <td>{{ user.name }}</td>
                <td>{{ user.lote }}</td>
                <td>{{ user.stock }}</td>
                <td>{{ getDate(user.fecha_vencimiento) }}</td>
                <td>
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
    <q-dialog v-model="reportdialog">
      <q-card>
        <q-toolbar>
          <q-avatar>
            <img src="logo.png" style="width: 64px; height: auto" />
          </q-avatar>

          <q-toolbar-title
            ><span class="text-weight-bold">ASIC APP</span> Registro de
            {{ movimientoType ? "entrada" : "salida" }}
          </q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <section class="row" style="margin-top: 1em">
            <div class="col-12">
              <q-date
                v-model="fecha_report_movimientos"
                mask="YYYY/MM/DD"
                color="teal"
                filled
                dense
                style="width: 100%"
                range
              />
            </div>
            <div class="col-12" align="center">
              <q-btn
                label="Descargar report"
                color="green"
                @click="descargarMovimientos()"
                style="margin: 1em"
              />
              <q-btn
                label="Cancelar"
                color="red"
                @click="reportdialog = false"
                style="margin: 1em"
              />
            </div>
          </section>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="toolbar">
      <q-card>
        <q-toolbar>
          <q-avatar>
            <img src="logo.png" style="width: 64px; height: auto" />
          </q-avatar>

          <q-toolbar-title
            ><span class="text-weight-bold">ASIC APP</span> Registro de
            {{ movimientoType ? "entrada" : "salida" }}
          </q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          <q-select
            label="Insumo medico"
            v-model="selectMedicamento"
            :options="optionsMedicamentos"
            @filter="filterFn"
            filled
            use-input
            input-debounce="0"
          ></q-select>
          <q-input
            label="Cantidad"
            v-model="stockMedicamento"
            type="number"
            :rules="[(val) => val > 0 || 'Cantidad invalida']"
          ></q-input>
          <q-select
            label="Consultorios"
            v-model="selectConsultorio"
            :options="consultorios"
            v-show="movimientoType ? false : true"
          />
          <section class="row" style="margin-top: 1em">
            <div class="col-12" align="center">
              <q-btn
                label="Enviar"
                color="green"
                @click="crearMovimiento()"
                style="margin: 1em"
              />
              <q-btn
                label="Cancelar"
                color="red"
                @click="toolbar = false"
                style="margin: 1em"
              />
            </div>
          </section>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-page-sticky
      position="bottom-right"
      style="margin-right: 2em; margin-bottom: 2em"
    >
      <q-fab
        icon="inventory"
        direction="up"
        color="blue"
        style="margin-right: 1em"
      >
        <q-fab-action
          color="green"
          icon="arrow_downward"
          @click="movimiento(true)"
        />
        <q-fab-action
          color="red"
          icon="arrow_upward"
          @click="movimiento(false)"
        />
        <q-fab-action
          color="primary"
          icon="edit_calendar"
          @click="reportdialog = true"
        />
      </q-fab>
      <q-fab icon="list" direction="up" color="accent">
        <q-fab-action color="green" icon="add" to="register_producto" />
        <!-- <q-fab-action color="primary" icon="search" @click="search()" /> -->
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
const toolbar = ref(false);
const router = useRouter();
const $q = useQuasar();
const consultorios = ref([]);
const paginate = ref({
  currentPage: 1,
  perPage: 10,
  totalPages: 10,
});
const reportdialog = ref(false);
const fecha_report_movimientos = ref(null);
const getDate = (fecha) => {
  const date = new Date(fecha);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
const users = ref([]);
watch(paginate.value, async (val) => {
  console.log(val.currentPage);
  await getData();
});

//para registrar movimientos
const medicamentos = ref([]);
const optionsMedicamentos = ref([]);
const selectMedicamento = ref("");
const stockMedicamento = ref(null);
const movimientoType = ref(false);
const filterFn = (val, update, abort) => {
  // simulate Ajax
  setTimeout(() => {
    const needle = val.toLowerCase();
    update(() => {
      optionsMedicamentos.value = medicamentos.value
        .filter((v) => v.label.toLowerCase().includes(needle))
        .slice(0, 10);
    });
  }, 0);
};
const selectConsultorio = ref("");
const part5 = async () => {
  const { data, error } = await supabase.from("consultorios").select("*");
  if (error) {
    Notify.create({
      message: "Compruebe su conexión a internet",
      color: "red",
      icon: "report_problem",
    });
  } else {
    consultorios.value = data.map((consultorio) => {
      return {
        label: consultorio.nombre,
        value: consultorio.id,
      };
    });
  }
};
const part4 = async () => {
  const { data, error } = await supabase.from("productos").select("id,name");
  if (error) {
    Notify.create({
      message: "Compruebe su conexión a internet",
      color: "red",
      icon: "report_problem",
    });
  } else {
    medicamentos.value = data.map((medicamento) => {
      return {
        label: medicamento.name,
        value: medicamento.id,
      };
    });
  }
};
onMounted(async () => {
  await part2();
  await getData();
  await part4();
  await part5();
});
const part2 = async () => {
  //counter consultorios
  const { data: count_user, error } = await supabase
    .from("productos")
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
      .from("productos")
      .select("id,lote,stock,name,fecha_vencimiento")
      .like("cedula", "%" + search_item.value + "%")
      .range(
        paginate.value.perPage * (paginate.value.currentPage - 1),
        paginate.value.perPage * paginate.value.currentPage
      )
      .order("id", { ascending: true });
  } else {
    var { data, error } = await supabase
      .from("productos")
      .select("id,lote,stock,name,fecha_vencimiento")
      .range(
        paginate.value.perPage * (paginate.value.currentPage - 1),
        paginate.value.perPage * paginate.value.currentPage
      )
      .order("id", { ascending: true });
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
    title: "Buscar por cedula",
    message: "Coloque la cedula",
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
    message: "Desea borrar el elemento seleccionado",
    cancel: true,
    persistent: true,
  })
    .onOk(async () => {
      const { error } = await supabase.from("productos").delete().eq("id", id);
      if (error) {
        Notify.create({
          message: "Compruebe su conexión a internet",
          color: "red",
          icon: "report_problem",
        });
      } else {
        Notify.create({
          message: "Datos borrado correctamente",
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
  localStorage.setItem("producto_id_edit", user.id);
  router.push("/register_producto");
};
const exportData = async () => {
  const { data, error } = await supabase.from("productos").select("*").csv();

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
    const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "data_productos.csv");
  }
};
const movimiento = (type) => {
  movimientoType.value = type;
  toolbar.value = !toolbar.value;
};
const crearMovimiento = async () => {
  if (selectMedicamento.value == "") {
    Notify.create({
      message: "Seleccione un medicamento",
      color: "red",
      icon: "report_problem",
    });
    return 10;
  }
  if (stockMedicamento.value == null) {
    Notify.create({
      message: "Ingrese el stock",
      color: "red",
      icon: "report_problem",
    });
    return 10;
  }
  if (stockMedicamento.value < 0) {
    Notify.create({
      message: "Ingrese un stock positivo",
      color: "red",
      icon: "report_problem",
    });
    return 10;
  }
  const { data: producto, error_consult } = await supabase
    .from("productos")
    .select("*")
    .eq("id", selectMedicamento.value.value);

  if (error_consult) {
    Notify.create({
      message: "Compruebe su conexión a internet",
      color: "red",
      icon: "report_problem",
    });
    return 10;
  }
  if (movimientoType.value == true) {
    const { error } = await supabase
      .from("productos")
      .update({
        stock: parseInt(producto[0].stock) + parseInt(stockMedicamento.value),
      })
      .eq("id", selectMedicamento.value.value);
    if (error) {
      Notify.create({
        message: "Compruebe su conexión a internet",
        color: "red",
        icon: "report_problem",
      });
    } else {
      Notify.create({
        message: "Movimiento creado correctamente",
        color: "green",
        icon: "check",
      });
      /*       await getData();
      await part2();
      await part4(); */
      const { data: create, error_create } = await supabase
        .from("inventario_movimiento")
        .insert({
          product_id: selectMedicamento.value.value,
          type: movimientoType.value,
          stock: stockMedicamento.value,
        });
      getData();
      selectConsultorio.value = "";
      toolbar.value = !toolbar.value;
      stockMedicamento.value = null;
      selectMedicamento.value = "";
    }
  } else {
    if (producto[0].stock < stockMedicamento.value) {
      Notify.create({
        message: "No hay suficiente stock",
        color: "red",
        icon: "report_problem",
      });
      return 10;
    }
    const { error } = await supabase
      .from("productos")
      .update({
        stock: parseInt(producto[0].stock) - parseInt(stockMedicamento.value),
      })
      .eq("id", selectMedicamento.value.value);
    if (error) {
      Notify.create({
        message: "Compruebe su conexión a internet",
        color: "red",
        icon: "report_problem",
      });
    } else {
      Notify.create({
        message: "Movimiento creado correctamente",
        color: "green",
        icon: "check",
      });
      const { data: create, error_create } = await supabase
        .from("inventario_movimiento")
        .insert({
          product_id: selectMedicamento.value.value,
          type: movimientoType.value,
          stock: stockMedicamento.value,
          consultorio_id: selectConsultorio.value.value,
        });
      getData();
      selectConsultorio.value = "";
      toolbar.value = !toolbar.value;
      stockMedicamento.value = null;
      selectMedicamento.value = "";
    }
  }
};
const descargarMovimientos = async () => {
  const { data, error } = await supabase
    .from("inventario_movimiento")
    .select(
      "id,productos(name,lote,fecha_vencimiento),stock,consultorios(nombre),type"
    )
    .gte("created_at", fecha_report_movimientos.value.from)
    .lte("created_at", fecha_report_movimientos.value.to);

  let data_csv = "";
  let obtener_consultorio = (consultorio) => {
    if (consultorio == null) {
      return "Sin consultorio";
    } else {
      return consultorio.nombre;
    }
  };
  let obtener_tipo = (tipo) => {
    if (tipo == true) {
      return "Entrada";
    } else {
      return "Salida";
    }
  };
  data_csv += "id,producto,lote,stock,vencimiento,consultorio,tipo \n";
  data.forEach((element) => {
    data_csv +=
      element.id +
      "," +
      element.productos.name +
      "," +
      element.productos.lote +
      "," +
      element.stock +
      "," +
      getDate(element.productos.fecha_vencimiento) +
      "," +
      obtener_consultorio(element.consultorios) +
      "," +
      obtener_tipo(element.type) +
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
/* const documentGet = async (user) => {
  window.open(baseURL + "asic_constancia/" + user.id, "_blank");
}; */
</script>
