const loginLocal = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};
const logoutLocal = () => {
  localStorage.removeItem("user");
};
const userLocal = () => {
  return JSON.parse(localStorage.getItem("user")) ?? null;
};
const updateLocal = (user) => {
  localStorage.removeItem("user");
  localStorage.setItem("user", JSON.stringify(user));
};

export { loginLocal, logoutLocal, userLocal, updateLocal };
