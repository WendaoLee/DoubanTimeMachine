import winston from 'winston'
import { Context,Effect, Layer } from 'effect'

const customFormat = winston.format.printf(({ message,level }) => {
  const date = new Date()
  const formattedDate = date.toLocaleString('zh-CN', { 
    timeZone: 'Asia/Shanghai', 
    fractionalSecondDigits: 3, 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  })
  
  return `[${formattedDate}] ${level.toUpperCase()} | ${message}`
})

const getLogger = (logFilePath: string) => {
    const fileTransportOptions: winston.transports.FileTransportOptions = {
        filename: logFilePath,
        maxsize: 10 * 1024 * 1024, // 10MB
        maxFiles: 3,              // 保留3个文件
        tailable: true,            // 允许追加到旧文件
        zippedArchive: true,       // 压缩旧日志
        rotationFormat: () => {
            const date = new Date()
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        }
    }
    return winston.createLogger({
        format: customFormat,
        transports: [
            new winston.transports.Console(),
            new winston.transports.File(fileTransportOptions)
        ]
    })
}

/**
 * 用于指明不同层级的日志输出到哪一层日志中。
 * 如果希望所有日志都输出到同一个文件中，则可以设置为相同的文件路径。
 */
export type LoggerFilesLayer = {
    debug: string
    info: string
    warn: string
    error: string
}

export type WinstonLogger = winston.Logger

export class LoggerService extends Context.Tag('LoggerService')<
    LoggerService,
    {
        readonly debugLog: (message: string) => void
        readonly infoLog: (message: string) => void
        readonly warnLog: (message: string) => void
        readonly errorLog: (message: string) => void
        readonly getLogger: () => winston.Logger
    }
>() {}

/**
 * 获取日志层
 * @param path 
 * @returns 
 */
export const getLoggerServiceLive = (path: LoggerFilesLayer) => Layer.effect(
    LoggerService,
    Effect.gen(function* () {
        return {
            debugLog: (message: string) => {
                const logger = getLogger(path.debug)
                logger.debug(message)
            },
            infoLog: (message: string) => {
                const logger = getLogger(path.info)
                logger.info(message)
            },
            warnLog: (message: string) => {
                const logger = getLogger(path.warn)
                logger.warn(message)
            },
            errorLog: (message: string) => {
                const logger = getLogger(path.error)
                logger.error(message)
            },
            getLogger: () => getLogger(path.info)
        }
    })
)