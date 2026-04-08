import type { Toast } from "@nuxt/ui/runtime/composables/useToast.js";

export type ExternalToast = Prettify<Partial<Omit<Toast, "title">>>;
declare global {
  var $alert: Alert;
}

interface Alert {
  (message: string, data?: ExternalToast): Toast;
  success(message: string, data?: ExternalToast): Toast;
  info(message: string, data?: ExternalToast): Toast;
  warning(message: string, data?: ExternalToast): Toast;
  error(message: string, data?: ExternalToast): Toast;
  message(message: string, data?: ExternalToast): Toast;
  dismiss(id?: string | number): void;
  loading(message: string, data?: ExternalToast): Toast;
}

function createAlert() {
  const toast = useToast();
  const Alert: Alert = ((message: string, data?: ExternalToast) => {
    return Alert.message(message, data);
  }) as Alert;

  Alert.info = function (message, data) {
    return toast.add({
      title: message,
      color: "info",
      ...data,
    });
  };

  Alert.success = function (message, data) {
    return toast.add({
      title: message,
      color: "success",
      ...data,
    });
  };

  Alert.warning = function (message, data) {
    return toast.add({
      title: message,
      color: "warning",
      ...data,
    });
  };

  Alert.error = function (message, data) {
    return toast.add({
      title: message,
      color: "error",
      ...data,
    });
  };

  Alert.message = function (message, data) {
    return toast.add({
      title: message,
      color: "neutral",
      ...data,
    });
  };

  Alert.dismiss = function (id) {
    if (!id) {
      return;
    }
    return toast.remove(id);
  };

  Alert.loading = function (message, data) {
    return toast.add({
      title: message,
      icon: "i-lucide-loader",
      ...data,
      ui: {
        icon: "animate-spin",
        ...data?.ui,
      },
    });
  };

  return Alert;
}

export default defineNuxtPlugin(() => {
  if (!globalThis.$alert) {
    Object.defineProperty(globalThis, "$alert", {
      value: createAlert(),
      writable: false,
      enumerable: true,
      configurable: false,
    });

    globalThis.alert = (message: string) => globalThis.$alert(message);
  }
});
