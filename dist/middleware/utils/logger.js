"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
// Define log levels and colors
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
const logger = winston_1.default.createLogger({
    level: 'info', // Default level
    levels,
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)),
    transports: [
        // 1. Output to the console
        new winston_1.default.transports.Console(),
        // 2. Save errors to a file
        new winston_1.default.transports.File({
            filename: 'logs/error.log',
            level: 'error',
        }),
        // 3. Save all logs to a file
        new winston_1.default.transports.File({ filename: 'logs/all.log' }),
    ],
});
exports.default = logger;
