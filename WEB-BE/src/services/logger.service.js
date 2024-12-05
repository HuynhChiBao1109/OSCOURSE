const winston = require('winston')
const time = require('moment')

class LoggerService {
    constructor(moduleName) {
        // if moduleName is not provided, using 'unknown' as default
        this.moduleName = moduleName || 'unknown'
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                winston.format.errors({ stack: true }),
                winston.format.splat(),
                winston.format.json()
            ),
            defaultMeta: { service: this.moduleName },
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.errors({ stack: true }),
                        winston.format.printf(
                            (info) =>
                                `${info.timestamp} ${info.level} [${
                                    info.service
                                }] - ${info.message}, ${info.stack || ''}`
                        )
                    ),
                }),
                new winston.transports.File({
                    filename: `logs/${time().format('YYYY-MM-DD')}.log`,
                    format: winston.format.combine(
                        // log in json format
                        winston.format.json()
                    ),
                }),
            ],
        })
    }
    // 4 levels log : VERBOSE, INFO, WARN, ERROR
    verbose(message) {
        this.logger.verbose(message)
    }

    info(message) {
        this.logger.info(message)
    }

    warn(message) {
        this.logger.warn(message)
    }

    error(message) {
        this.logger.error(message)
    }
}

module.exports = (moduleName) => {
    return new LoggerService(moduleName)
}
