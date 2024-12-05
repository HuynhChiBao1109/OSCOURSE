const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const log = require('../../../services/logger.service')('PaymentMutations')

/**
 * Object containing payment mutations.
 *
 * @typedef {Object} paymentMutaitons
 * @property {Function} payCourse - Mutation to pay for a course.
 */
const paymentMutaitons = {
    payCourse: async (parent, args, context, info) => {
        try {
            const { children_id, course_id } = args
            // check children_id and course_id exist
            const childrenExist = await prisma.children.findUnique({
                where: {
                    id: children_id,
                },
            })
            const courseExist = await prisma.course.findUnique({
                where: {
                    id: course_id,
                },
            })
            if (!childrenExist || !courseExist) {
                log.error('payCourse', 'Children or course not exist')
                throw new Error('Children or course not exist')
            }

            // check children_id have collected this course
            const collected = await prisma.collection.findFirst({
                where: {
                    children_id: children_id,
                    course_id: course_id,
                },
            })
            if (collected) {
                log.error(`payCourse: Children already collected this course`)
                throw new Error('Children already collected this course')
            }
            // check if children have pending transaction
            const transactionExist = await prisma.transaction.findFirst({
                where: {
                    children_id: children_id,
                    course_id: course_id,
                    status: 'pending',
                },
            })
            if (transactionExist) {
                log.error(`payCourse: Children have pending transaction`)
                throw new Error('Children have pending transaction')
            }
            // create payment
            // random transaction code with KHXXXXXX combination A-Z, 0-9
            // expired_at = created_at + 15 minutes
            // create new transaction code and query to transaction table to check if it's exist, if exist, create new one
            let transactionCode
            for (let i = 0; i < 999999; i++) {
                transactionCode = `KH${Math.random()
                    .toString(36)
                    .substring(2)
                    .toUpperCase()}`
                const transactionExist = await prisma.transaction.findFirst({
                    where: {
                        transaction_code: transactionCode,
                    },
                })
                if (!transactionExist) {
                    break
                }
            }
            const result = await prisma.transaction.create({
                data: {
                    children_id: children_id,
                    course_id: course_id,
                    amount: courseExist.price,
                    status: 'pending',
                    created_at: new Date(),
                    expired_at: new Date(new Date().getTime() + 15 * 60 * 1000),
                    transaction_code: transactionCode,
                },
            })
            log.info(`payCourse: ${JSON.stringify(result)}`)
            return {
                amount: result.amount,
                content: result.transaction_code,
            }
        } catch (error) {
            log.error('payCourse', error)
            global.Sentry.captureException(error)
            throw new Error('Failed to pay course')
        }
    },
}

module.exports = paymentMutaitons
