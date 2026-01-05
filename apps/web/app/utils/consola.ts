import { createConsola, type ConsolaReporter, type LogObject, consola } from "consola/browser";

export default function createLogger() {
  const reporters: ConsolaReporter[] = [
    {
      log: (logObj: LogObject) => {
        const { type, ...rest } = logObj;
        const initial = consola.level;
        consola.level = rest.level;
        const log = rest.message ? [rest.message, ...rest.args] : rest.args;
        // @ts-expect-error
        consola[type](...log);
        consola.level = initial;
      },
    },
  ];

  return createConsola({
    level: +999,
    reporters,
  });
}
