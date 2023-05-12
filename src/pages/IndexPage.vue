<template>
  <q-page
    class="flex flex-center"
    style="
      width: 100vw;
      height: 100%;
      background: url(f35d45c703b29e670b970eb48bc24c8b.jpg) no-repeat center
        center;
      background-size: cover;
    "
  >
    <section style="width: 80%; text-align: center">
      <q-card
        bordered
        style="padding: 1em; background: rgba(255, 255, 255, 0.8)"
      >
        <q-card-section>
          <div>
            <img
              src="https://img.icons8.com/color/96/null/venezuela-circular.png"
            />
          </div>
          <h4>Iniciar sesión</h4>
        </q-card-section>

        <q-separator dark inset />

        <q-card-section>
          <form>
            <q-input
              v-model="email"
              label="Email"
              type="email"
              lazy-rules
              :rules="[(val) => !!val || 'Please enter your email']"
            />
            <q-input
              v-model="password"
              label="Password"
              type="password"
              lazy-rules
              :rules="[(val) => !!val || 'Please enter your password']"
            />
            <q-btn
              @click="login"
              class="glossy"
              rounded
              color="primary"
              style="display: block; margin: 1em auto; width: 100%"
              label="Login"
            />
          </form>
        </q-card-section>
      </q-card>
    </section>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import supabase from "src/supabase";
import { Notify } from "quasar";
import { useRouter } from "vue-router";
import { loginLocal, userLocal } from "../composables/localStorage";

const router = useRouter();
const email = ref("");
const password = ref("");
onMounted(() => {
  console.log(userLocal());
  if (userLocal() !== null) {
    router.push("/home");
  }
});
const login = async () => {
  const { data, error } = await supabase
    .from("Usuarios")
    .select("*")
    .eq("email", email.value)
    .eq("password", password.value);
  if (error) {
    Notify.create({
      message: "Compruebe su conexión a internet",
      color: "red",
      icon: "report_problem",
    });
  } else {
    if (data.length > 0) {
      Notify.create({
        message: "Bienvenido",
        color: "green",
        icon: "check",
      });
      loginLocal(data[0]);
      router.push("/home");
    } else {
      Notify.create({
        message: "Usuario o contraseña incorrectos",
        color: "red",
        icon: "report_problem",
      });
    }
  }
};
</script>
