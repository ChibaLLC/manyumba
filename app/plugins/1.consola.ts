import createLogger from "@/utils/consola";
import type { ConsolaInstance } from "consola";

declare global {
  var consola: ConsolaInstance;
}

export default defineNuxtPlugin(async () => {
  const logger = createLogger();
  if (globalThis.consola) return;
  Object.defineProperty(globalThis, "consola", {
    value: logger,
    writable: false,
    enumerable: true,
    configurable: false,
  });
});
