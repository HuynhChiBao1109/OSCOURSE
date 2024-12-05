const App = require('./app')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const compression = require('compression')
const log = require('../services/logger.service')('RestApp')
const router = require('../routes')

class RestApp extends App {
    constructor() {
        super()
    }

    start() {
        try {
            super.start('RestApp')
            this.app = express()
            this.app.use(compression())
            this.app.use(bodyParser.json())
            this.app.use(cors())
            this.app.use(
                `/${global.config.get('API_ENDPOINT')}/v${global.config.get(
                    'API_VERSION'
                )}`,
                router
            )
            this.app.listen(global.config.get('APP_PORT'), () => {
                log.info(
                    `RestApp listening on port ${global.config.get('APP_PORT')}`
                )
                log.info(
                    `RestApp API endpoint: ${global.config.get(
                        'API_ENDPOINT'
                    )}/v${global.config.get('API_VERSION')}`
                )
                log.info(
                    `Swagger API documentation: http://${global.config.get(
                        'APP_HOST'
                    )}:${global.config.get('APP_PORT')}/api-docs/`
                )
            })
        } catch (error) {
            log.error(error)
            global.Sentry.captureException(error)
            process.exit(1)
        }
    }

    stop() {
        super.stop()
    }

    restart() {
        super.restart()
    }
}

module.exports = RestApp
