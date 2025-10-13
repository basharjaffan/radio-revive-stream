import pino from 'pino';

export const logger = pino.default({
  level: 'debug',  // Visa alla meddelanden inklusive debug
  transport: process.env.NODE_ENV === 'production'
    ? undefined
    : {
        target: 'pino-pretty',
        options: { colorize: true }
      }
});
