const { PrismaClient } = require('@prisma/client')
const log = require('../../../services/logger.service')('notificationQueriess')
const supabase = require('../../../configs/supabase.config')

const prisma = new PrismaClient()

/**
 * Object containing resolver functions for notification queries.
 * @namespace notificationQueries
 */
const notificationQueries = {
    /**
     * Retrieves a list of notifications by user ID.
     *
     * @async
     * @function getListNotificationByUserId
     * @memberof notificationQueries
     * @param {Object} parent - The parent object.
     * @param {Object} args - The arguments object.
     * @param {Object} context - The context object.
     * @param {Object} info - The info object.
     * @returns {Promise<Array<Object>>} - A promise that resolves to an array of notification objects.
     * @throws {Error} - If there is an error retrieving the notifications.
     */
    getListNotificationByUserId: async (parent, args, context, info) => {
        try {
            const { data, error } = await supabase
                .from('notification')
                .select('*')
                .eq('user_id', args.user_id)
            if (error) {
                log.error('getListNotificationByUserId', error)
                throw new Error(error.message)
            }
            return data
        } catch (error) {
            log.error('getListNotificationByUserId', error)
            global.Sentry.captureException(error)
            throw new Error('Error getting list notification')
        }
    },
}

module.exports = notificationQueries
