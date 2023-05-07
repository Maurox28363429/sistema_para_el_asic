import { useQuasar } from "quasar";

export const useToast = () => {
  const $q = useQuasar();

  const triggerPositive = (message) => {
    $q.notify({
      type: "positive",
      message,
    });
  };

  const triggerWarning = (message) => {
    $q.notify({
      type: "warning",
      message,
    });
  };

  return { triggerPositive, triggerWarning };
};
