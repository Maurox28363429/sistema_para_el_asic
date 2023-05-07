import { defineStore } from "pinia";

export const userStore = defineStore("userStore", {
  state: () => ({
    user: null,
  }),
  getters: {
    user: (state) => state.user,
  },
  actions: {
    logout() {
      this.state.user = null;
      localStorage.removeItem("user");
    },
    login(user) {
      console.log("userStore.login", user);
      this.state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
  },
});
