const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const axios = require('axios')
const log = require('../services/logger.service')('ScheduleService')

const init = async () => {
    log.info('Initializing schedule service')
    setInterval(checkExpiredCourse, 1000 * 60) // 1 minute
    setInterval(checkExpiredTransaction, 1000 * 60) // 1 minute
    setInterval(refreshBalance, 1000 * 60 * 5) // 1 minute
    // setInterval(, 1000 * 60 * 60 * 24) // 1 day
}
// check expired course and update status
/**
 * Checks for expired courses and updates their status to 'inActive'.
 * @returns {Promise<void>} A promise that resolves when the check is complete.
 */
const checkExpiredCourse = async () => {
    const listCollection = await prisma.collection.findMany()

    try {
        for (let i = 0; i < listCollection.length; i++) {
            const expired_at = listCollection[i].expired_at
            if (new Date() > expired_at) {
                await prisma.collection.update({
                    where: {
                        id: listCollection[i].id,
                    },
                    data: {
                        status: 'inActive',
                    },
                })
            }
        }
    } catch (error) {
        log.error(`Error: ${error.message}`)
        global.Sentry.captureException(error)
    }

    log.info('checkExpiredCourse: Done')
}

const checkExpiredTransaction = async () => {
    const listTransaction = await prisma.transaction.findMany()

    try {
        for (let i = 0; i < listTransaction.length; i++) {
            const expired_at = listTransaction[i].expired_at
            if (new Date() > expired_at) {
                await prisma.transaction.update({
                    where: {
                        id: listTransaction[i].id,
                    },
                    data: {
                        status: 'failed',
                    },
                })
            }
        }
    } catch (error) {
        log.error(`Error: ${error.message}`)
        global.Sentry.captureException(error)
    }
    log.info('checkExpiredTransaction: Done')
}

const refreshBalance = async () => {
    // check if any transaction is pending
    const listTransaction = await prisma.transaction.findMany({
        where: {
            status: 'pending',
        },
    })
    if (listTransaction.length > 0) {
        try {
            let data = JSON.stringify({
                bank_acc_id: '39397979112001',
            })

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://oauth.casso.vn/v2/sync',
                headers: {
                    Authorization:
                        'Apikey AK_CS.09809a30de5a11ee9bf047310018d428.RFGxMogU2D9mCJSgyit2qAGP1HNQOBiEQaUnl4zOcSEWpxPvFv706KEphlpYkvITgxGCj1cV',
                    'Content-Type': 'application/json',
                },
                data: data,
            }

            axios
                .request(config)
                .then((response) => {
                    log.info(`Refresh balance success`)
                })
                .catch((error) => {
                    log.error(`Error: ${error.message}`)
                })
        } catch (error) {
            log.error(`Error: ${error.message}`)
            global.Sentry.captureException(error)
        }
        log.info('refreshBalance: Done')
    }
}

const checkCollectionExpired = async () => {
    try {
        const listCollection = await prisma.collection.findMany({
            where: {
                expired_at: {
                    lte: new Date(),
                },
            },
        })
        // update status of expired collection
        for (const collection of listCollection) {
            await prisma.collection.update({
                where: {
                    id: collection.id,
                },
                data: {
                    status: 'inActive',
                },
            })
        }
    } catch (error) {
        log.error(`Error: ${error.message}`)
        global.Sentry.captureException(error)
    }
    log.info('checkCollectionExpired: Done')
}

module.exports = {
    init,
}
