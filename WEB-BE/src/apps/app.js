const log = require('../services/logger.service')

class App {
    /**
     * Represents an instance of the App class.
     * @constructor
     */
    constructor() {
        this.type = '' // should not be null
        this.log = '' // should not be null
    }

    /**
     * Starts the application.
     *
     * @param {string} type - The type of the application.
     */
    start(type) {
        this.type = type
        this.log = log(this.type)
        this.log.info(`Starting ${this.type}...`)
    }

    /**
     * Stops the application.
     */
    stop() {
        this.log.info(`Stopping ${this.type}...`)
    }

    /**
     * Restarts the application.
     */
    restart() {
        this.stop()
        this.start()
    }
}

module.exports = App
