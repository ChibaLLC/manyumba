import { createConsola, consola, type ConsolaOptions, type ConsolaReporter } from "consola";

type Options = Omit<Partial<ConsolaOptions>, "reporters">;
export function createLogger(options?: Options, additionalReporters?: ConsolaReporter[]) {
  const reporters: ConsolaReporter[] = [
    {
      log(logObj) {
        const tagged = logObj.tag ? consola.withTag(logObj.tag) : consola;
        const level = tagged[logObj.type] ?? tagged.log;
        level(
          `[${logObj.date.toLocaleString("en-US", {
            timeZone: "Africa/Nairobi",
          })}]`,
          ...logObj.args,
        );
      },
    },
  ];

  if (additionalReporters) {
    reporters.push(...additionalReporters);
  }

  const base: Partial<ConsolaOptions> = {
    reporters,
  };

  return createConsola({ ...base, ...options });
}

const logger = createLogger();
export { logger as consola };
export default createLogger;
