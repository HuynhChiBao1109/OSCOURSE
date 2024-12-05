const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const log = require('../../../services/logger.service')('PaymentQueries')

const paymentQueries = {
    getPaymentStatus: async (parent, args, context, info) => {
        try {
            const result = await prisma.transaction.findUnique({
                where: {
                    transaction_code: args.content,
                },
            })
            console.log(`result`, JSON.stringify(result))
            return result

        } catch (error) {
            log.error(`getPaymentStatus: ${error.message}`)
            global.Sentry.captureException(error)
            return []
        }
    },
}

module.exports = paymentQueries
