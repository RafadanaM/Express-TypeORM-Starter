import pinoHttp from 'pino-http';
import logger from './logger';

const loggerMiddleware = pinoHttp({
  logger: logger,
  autoLogging: true,

  wrapSerializers: false,

  serializers: {},

  customReceivedMessage(req, _) {
    return `REQUEST: (ID:${req.id}) ${req.method} ${req.url} ${req.socket.remoteAddress}`;
  },

  customSuccessMessage(req, res) {
    return `RESPONSE: (ID:${req.id}) ${req.method} ${req.url} ${res.statusCode} ${res.statusMessage}`;
  },
});

export default loggerMiddleware;
