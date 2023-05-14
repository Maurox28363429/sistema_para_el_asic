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
      background: #bbdefb;
    "
  >
    <section>
      <div class="row">
        <div class="col-12 col-md-6" style="padding: 1em">
          <q-card class="my-card" style="background: white">
            <h5 align="center" style="padding: 1em">
              Usuarios del sistema: {{ usuarios_count }}
            </h5>
            <q-card-section>
              <img
                :src="chartUrl"
                style="width: 100%; height: auto; margin: auto"
                alt="My Awesome Chart"
              />
              <q-btn
                label="Ver usuarios"
                color="primary"
                class="q-mt-md"
                @click="router.push('/usuarios')"
                v-show="user.role_id == 1"
              />
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-6" style="padding: 1em">
          <q-card class="my-card" style="background: white">
            <h5 align="center" style="padding: 1em">Tallas de Camisa</h5>
            <q-card-section>
              <div>
                <img
                  :src="chartUrlCamisa"
                  style="width: 100%; height: auto; margin: auto"
                  alt="My Awesome Chart"
                />
              </div>
              <div>
                <q-btn
                  label="Actualizar"
                  color="green"
                  icon="autorenew"
                  @click="tallaCamisas"
                  style="margin: 1em"
                />
                <q-btn
                  v-show="user.role_id == 1"
                  label="Descargar Tallas"
                  color="primary"
                  icon="get_app"
                  class="q-mt-md"
                  @click="descargarTallasGeneral()"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-6" style="padding: 1em">
          <q-card class="my-card" style="background: white">
            <h5 align="center" style="padding: 1em">
              Usuarios por consultorio
            </h5>
            <q-card-section>
              <img
                :src="chartUrlConsultorios"
                style="width: 100%; height: auto; margin: auto"
                alt="Usuarios por consultorio"
              />
              <q-btn
                label="Actualizar"
                color="green"
                @click="segundo_chat_recarga"
                style="margin: 1em"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
          fab
          icon="autorenew"
          color="green"
          @click="
            recargar();
            segundo_chat_recarga();
          "
        />
      </q-page-sticky>
    </section>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import supabase from "src/supabase";
import { Notify } from "quasar";
import { useRouter } from "vue-router";
import QuickChart from "quickchart-js";
import { saveAs } from "file-saver";
import { logoutLocal, userLocal } from "../composables/localStorage";
const user = ref(userLocal());

const router = useRouter();
const usuarios_count = ref(0);
const admin_count = ref(0);
const obreros_count = ref(0);
const salud_count = ref(0);
const chartUrlConsultorios = ref("");
//inir default chart
const chartUrl = ref("");
const randomColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};
onMounted(async () => {
  recargar();
  segundo_chat_recarga();
  tallaCamisas();
});

const recargar = async () => {
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
    usuarios_count.value = count_user[0].count;
  }
  //counter admin
  const { data: count_admin, error2 } = await supabase
    .from("Usuarios")
    .select("count", { count: "exact" })
    .eq("role_id", 1);
  if (error2) {
    Notify.create({
      message: "Compruebe su conexión a internet",
      color: "red",
      icon: "report_problem",
    });
  } else {
    admin_count.value = count_admin[0].count;
  }
  //counter Obreros
  const { data: count_obrero, error3 } = await supabase
    .from("Usuarios")
    .select("count", { count: "exact" })
    .eq("role_id", 4);
  if (error3) {
    Notify.create({
      message: "Compruebe su conexión a internet",
      color: "red",
      icon: "report_problem",
    });
  } else {
    obreros_count.value = count_obrero[0].count;
  }
  //counter salud
  const { data: count_salud, error4 } = await supabase
    .from("Usuarios")
    .select("count", { count: "exact" })
    .eq("role_id", 5);
  if (error4) {
    Notify.create({
      message: "Compruebe su conexión a internet",
      color: "red",
      icon: "report_problem",
    });
  } else {
    salud_count.value = count_salud[0].count;
  }
  const chart = new QuickChart();
  chart.setConfig({
    type: "pie",
    data: {
      labels: ["Administradores", "Profesionales de la salud", "Obreros"],
      datasets: [
        {
          label: "Colors",
          data: [admin_count.value, salud_count.value, obreros_count.value],
          backgroundColor: ["#42a5f5", "#3f51b5", "#009688"],
        },
      ],
    },
  });
  chartUrl.value = chart.getUrl();
}; //end

const segundo_chat_recarga = async () => {
  const { data: count_consultorios, error } = await supabase
    .from("consultorios")
    .select("*");
  if (error) {
    Notify.create({
      message: "Compruebe su conexión a internet",
      color: "red",
      icon: "report_problem",
    });
  } else {
    const usuarios_consultorio = [];
    for (let i = 0; i < count_consultorios.length; i++) {
      const { data: count_user, error } = await supabase
        .from("Usuarios")
        .select("count", { count: "exact" })
        .eq("consultorio_id", count_consultorios[i].id);
      if (error) {
        Notify.create({
          message: "Compruebe su conexión a internet",
          color: "red",
          icon: "report_problem",
        });
      } else {
        usuarios_consultorio.push(count_user[0].count);
      }
    }
    console.log(count_consultorios);
    console.log(usuarios_consultorio);
    console.log(randomColor());
    const chart = new QuickChart();
    chart.setConfig({
      type: "bar",
      data: {
        labels: count_consultorios.map((item) => item.nombre),
        datasets: [
          {
            label: "Usuarios por consultorio",
            data: usuarios_consultorio,
            backgroundColor: usuarios_consultorio.map((item) => randomColor()),
          },
        ],
      },
    });
    chartUrlConsultorios.value = chart.getUrl();
  }
};
const chartUrlCamisa = ref("");
const tallaCamisas = async () => {
  const { data: count_talla, error } = await supabase
    .from("Usuarios")
    .select("talla_camisa");
  if (error) {
    Notify.create({
      message: "Compruebe su conexión a internet",
      color: "red",
      icon: "report_problem",
    });
  } else {
    const talla_camisa = [];
    for (let i = 0; i < count_talla.length; i++) {
      if (count_talla[i].talla_camisa != null) {
        talla_camisa.push(count_talla[i].talla_camisa);
      }
    }
    const talla_camisa_count = talla_camisa.reduce(function (obj, b) {
      obj[b] = ++obj[b] || 1;
      return obj;
    }, {});
    console.log(talla_camisa_count);
    const chart = new QuickChart();
    chart.setConfig({
      type: "pie",
      data: {
        labels: Object.keys(talla_camisa_count),
        datasets: [
          {
            label: "Colors",
            data: Object.values(talla_camisa_count),
            backgroundColor: [
              "#42a5f5",
              "#3f51b5",
              "#009688",
              "#4caf50",
              "#ffeb3b",
              "#ff9800",
              "#f44336",
            ],
          },
        ],
      },
    });
    chartUrlCamisa.value = chart.getUrl();
  }
};
const descargarTallasGeneral = async () => {
  const { data: tallas, error } = await supabase
    .from("Usuarios")
    .select("talla_camisa,talla_pantalon,talla_zapatos");
  if (error) {
    Notify.create({
      message: "Compruebe su conexión a internet",
      color: "red",
      icon: "report_problem",
    });
  } else {
    const camisas = [];
    const pantalones = [];
    const zapatos = [];
    for (let i = 0; i < tallas.length; i++) {
      if (tallas[i].talla_camisa != null) {
        camisas.push(tallas[i].talla_camisa);
      }
      if (tallas[i].talla_pantalon != null) {
        pantalones.push(tallas[i].talla_pantalon);
      }
      if (tallas[i].talla_zapatos != null) {
        zapatos.push(tallas[i].talla_zapatos);
      }
    }
    const camisas_count = camisas.reduce(function (obj, b) {
      obj[b] = ++obj[b] || 1;
      return obj;
    }, {});
    const pantalones_count = pantalones.reduce(function (obj, b) {
      obj[b] = ++obj[b] || 1;
      return obj;
    }, {});
    const zapatos_count = zapatos.reduce(function (obj, b) {
      obj[b] = ++obj[b] || 1;
      return obj;
    }, {});

    //incluir saltos de linea
    const data_csv = `\n,Talla camisa, Cantidad\n, ${Object.keys(
      camisas_count
    ).map(
      (item) => item + "," + camisas_count[item] + "\n"
    )}\n,Talla pantalon, Cantidad\n,${Object.keys(pantalones_count).map(
      (item) => item + "," + pantalones_count[item] + "\n"
    )}\n,Talla zapatos, Cantidad\n,${Object.keys(zapatos_count).map(
      (item) => item + "," + zapatos_count[item] + "\n"
    )}`;

    console.log(data_csv);
    const csvContent = "data:text/csv;charset=utf-8," + data_csv;
    const encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
    // const blob = new Blob([data_csv], { type: "text/csv;charset=utf-8;" });
    //saveAs(blob, "data_movimientos.csv");
  }
};
</script>
