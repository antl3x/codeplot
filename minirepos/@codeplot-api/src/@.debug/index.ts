import debug, { Debugger } from "debug";
import { test } from "@.core.file";

// Using 'as const' to define levels and categories
const levels = ["info", "warn", "error"] as const;
const categories = ["core", "websocket", "express"] as const;

// Defining LogLevel and LogCategory as union types of the literal types
type LogLevel = (typeof levels)[number];
type LogCategory = (typeof categories)[number];

// Define the structure of the loggers object using mapped types
type Loggers = {
  [L in LogLevel]: {
    [C in LogCategory]: Debugger;
  };
};

// Function to generate loggers based on predefined levels and categories
function _generateLoggers(): Loggers {
  test();
  const loggers: Partial<Loggers> = {};

  (levels as ReadonlyArray<LogLevel>).forEach((level) => {
    loggers[level] = {} as Record<LogCategory, Debugger>;
    (categories as ReadonlyArray<LogCategory>).forEach((category) => {
      loggers[level]![category] = debug(`codeplot:${level}:${category}`);
    });
  });

  return loggers as Loggers;
}

// Export the generated loggers
export default _generateLoggers();
