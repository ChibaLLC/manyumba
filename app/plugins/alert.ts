declare global {
  var $alert: (message: string) => void;
}

export default defineNuxtPlugin(() => {
  try {
    if (!!$alert) return;
  } catch (_) {}

  Object.defineProperty(window || global, "$alert", {
    value: window?.alert || function () {},
  });
});
