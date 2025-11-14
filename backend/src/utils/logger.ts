/**
 * @summary Basic logger utility.
 * @description A simple wrapper around console logging. Can be replaced with a more robust logger like Winston.
 */

const log = (level: 'info' | 'warn' | 'error', message: string, context?: object) => {
  const timestamp = new Date().toISOString();
  const logObject = {
    timestamp,
    level,
    message,
    ...context,
  };
  console[level](JSON.stringify(logObject));
};

export const logger = {
  info: (message: string, context?: object) => log('info', message, context),
  warn: (message: string, context?: object) => log('warn', message, context),
  error: (message: string, context?: object) => log('error', message, context),
};
