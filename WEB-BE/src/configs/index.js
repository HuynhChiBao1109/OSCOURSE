const log = require('../services/logger.service')

/**
 * Represents a configuration class.
 * @class
 */
class Config {
    /**
     * Represents a configuration object.
     * @constructor
     * @param {string} enviroment - The environment for the configuration.
     */
    constructor(enviroment) {
        this.log = log(`Config::${enviroment}`)
        this.enviroment = enviroment
        // if enviroment is development, using dotenv to load .env.development
        try {
            if (enviroment === 'development') {
                require('dotenv').config({
                    path: '.env.development',
                })
            }
            // if enviroment is production, using dotenv to load .env.production
            if (enviroment === 'production') {
                require('dotenv').config({
                    path: '.env.production',
                })
            }
        } catch (error) {
            global.Sentry.captureException(error)
            this.log.error(`Error loading .env.${enviroment} error: ${error}`)
        }
    }

    /**
     * Retrieves the value of the specified environment variable.
     * @param {string} key - The name of the environment variable.
     * @returns {string|undefined} The value of the environment variable, or undefined if it is not set.
     */
    get(key) {
        try {
            this.log.info(`Getting key ${key} value: ${process.env[key]}`)
            return process.env[key]
        } catch (error) {
            global.Sentry.captureException(error)
            this.log.error(`Error getting key ${key} error: ${error}`)
        }
    }

    /**
     * Sets the value of a given key in the environment variables.
     *
     * @param {string} key - The key to set.
     * @param {string} value - The value to set for the key.
     * @returns {void}
     */
    set(key, value) {
        try {
            this.log.info(`Setting key ${key} value: ${value}`)
            process.env[key] = value
        } catch (error) {
            global.Sentry.captureException(error)
            this.log.error(`Error setting key ${key} error: ${error}`)
        }
    }
}

module.exports = (enviroment) => {
    return new Config(enviroment)
}
