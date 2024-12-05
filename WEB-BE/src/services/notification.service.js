const supabase = require('../configs/supabase.config')

class NotificationServer {
    /**
     * Sends a notification to a user.
     *
     * @param {string} message - The message content of the notification.
     * @param {number} user_id - The ID of the user to send the notification to.
     * @returns {Promise<object>} - A promise that resolves to the inserted data if successful.
     * @throws {Error} - If there is an error inserting the notification.
     */
    async sendNotification(message, user_id) {
        const { data, error } = await supabase.from('notification').insert([
            {
                user_id: user_id,
                message: message,
                is_read: false,
            },
        ])
        if (error) {
            throw new Error(error.message)
        }
        return data
    }
}

module.exports = new NotificationServer()
