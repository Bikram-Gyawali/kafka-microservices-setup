import winston from "winston";
import path from "path";
import { configs } from "../configs/env.config";

const isDev = configs.NODE_ENV === "development";

const logDir = path.join(__dirname, "../logs");
const logFile = path.join(logDir, "app.log");
const errorLogFile = path.join(logDir, "error.log");

// Logger configuration
const logger = winston.createLogger({
  level: isDev ? "debug" : "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: logFile,
      level: "info",
      maxsize: 5 * 1024 * 1024, // 5MB per log file
      maxFiles: 5, 
    }),
    new winston.transports.File({
      filename: errorLogFile,
      level: "error",
    }),
  ],
});

// In development, log to the console 
if (isDev) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export default logger;
