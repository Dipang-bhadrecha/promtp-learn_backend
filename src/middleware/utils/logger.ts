import winston from 'winston';

// Define log levels and colors
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logger = winston.createLogger({
  level: 'info', // Default level
  levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
  ),
  transports: [
    // 1. Output to the console
    new winston.transports.Console(),
    // 2. Save errors to a file
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    // 3. Save all logs to a file
    new winston.transports.File({ filename: 'logs/all.log' }),
  ],
});

export default logger;