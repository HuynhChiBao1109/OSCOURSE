// error middleware
const log = require('../services/logger.service')('ErrorHandlerMiddleware')

module.exports = (error, req, res, next) => {
    log.error(`Error: ${error.message}`)
    global.Sentry.captureException(error)
    res.status(500).json({
        message: error.message,
    })
    next()
}
