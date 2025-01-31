const { createLogger, format, transports } = require("winston");
const { combine, timestamp, json, colorize } = format;
const config = require("./config.js");

const enumerateErrorFormat = format((info) => {
    if (info instanceof Error) {
      Object.assign(info, { message: info.stack });
    }
    return info;
  });

  const logger = createLogger({
    level: config.logLevel,
    format: format.combine(
      enumerateErrorFormat(),
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      format.splat(),
      format.printf(({ level, message, timestamp }) => `${timestamp}: ${level}: ${message}`)
    ),
    transports: [
      //  new transports.File({ filename: 'logs/error.log', level: 'error' }),
      //  new transports.File({ filename: 'logs/combined.log' }),
      new transports.Console({
        format: format.combine(
          enumerateErrorFormat(),
          format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          format.splat(),
          format.colorize(),
          format.printf(
            ({ level, message, timestamp, className = "", methodName = "", CID = "", topicId = "", threadId = "", lineNumber = "" }) =>
              ` ${timestamp} | ${level} | ${className} | ${methodName} | ${lineNumber} | ${message} | ${CID} | ${topicId} | ${threadId}`
          )
        )
      })
    ]
  });
  
  module.exports = logger;
  