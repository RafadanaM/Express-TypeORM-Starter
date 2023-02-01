import pino from 'pino';

// src: https://css-tricks.com/how-to-implement-logging-in-a-node-js-application-with-pino-logger/
const levels = {
  http: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

const logger = pino({
  customLevels: levels,
  useOnlyCustomLevels: true,
  level: 'http',
  serializers: {
    err: () => undefined,
    req: () => undefined,
    res: () => undefined,
  },
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      levelFirst: true,
      translateTime: 'SYS:dd-mm-yyyy, HH:MM:ss',
      ignore: 'hostname,pid',
    },
  },
});
export default logger;
