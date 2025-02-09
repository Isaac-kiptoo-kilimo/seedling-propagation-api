import winston from "winston";

const { format, transports } = winston;
const { combine, timestamp } = format;

const consoleTransportFormat = combine(
  timestamp(),
  format.errors(),
  format.json()
);

const logger = winston.createLogger({
  level: "info",
  defaultMeta: { service: "api" },
  transports: [
    new transports.Console({
      format: consoleTransportFormat,
    }),
  ],
  exitOnError: false,
});

export default logger;
