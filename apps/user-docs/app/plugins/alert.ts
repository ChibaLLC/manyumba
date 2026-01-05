import { toast } from "vue-sonner";

declare global {
  var $alert: typeof toast;
}

export default defineNuxtPlugin(() => {
  if (import.meta.server) {
    // @ts-expect-error
    if (globalThis.$alert) return;
    Object.defineProperty(globalThis, "$alert", {
      value: (...args: any[]) => {
        console.warn("Toast in server");
        console.log(args);
        return undefined;
      },
      writable: false,
      enumerable: true,
      configurable: false,
    });
    return;
  }

  if (!globalThis.$alert) {
    Object.defineProperty(window, "$alert", {
      value: toast,
      writable: false,
      enumerable: true,
      configurable: false,
    });

    globalThis.alert = (message: string) => globalThis.$alert(message);
  }

  return {
    provide: {
      alert: toast,
      toast,
    },
  };
});
