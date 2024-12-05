const { createClient } = require('@supabase/supabase-js')
const log = require('../services/logger.service')('SupabaseDB')

/**
 * Represents a connection to the Supabase database.
 */
class SupabaseDB {
    constructor() {
        this.client = ''
    }

    /**
     * Initializes the SupabaseDB instance by connecting to the database.
     * @returns {Promise<SupabaseClient>} A promise that resolves to the Supabase client.
     */
    async init() {
        return await this.connect()
    }

    /**
     * Connects to the Supabase database.
     * @returns {SupabaseClient} The Supabase client.
     */
    async connect() {
        try {
            this.client = createClient(
                global.config.get('SUPABASE_URL'),
                global.config.get('SUPABASE_KEY'),
                {
                    autoRefreshToken: true,
                    persistSession: true,
                }
            )
            if (this.client) {
                log.info('SupabaseDB connected')
            }
        } catch (error) {
            log.error(`Error: ${error.message}`)
            global.Sentry.captureException(error)
        }
        return this.client
    }

    /**
     * Disconnects from the Supabase database.
     */
    async disConnect() {
        this.client = ''
    }
}

module.exports = () => {
    return new SupabaseDB()
}
