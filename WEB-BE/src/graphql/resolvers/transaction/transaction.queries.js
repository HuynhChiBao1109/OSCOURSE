const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const log = require('../../../services/logger.service')('TransactionQueries')

/**
 * Contains resolver functions for transaction queries.
 * @typedef {Object} TransactionQueries
 * @property {Function} getListTransactionByAdmin - Retrieves a list of transactions for admin.
 * @property {Function} getListTransactionByUser - Retrieves a list of transactions for a specific user.
 */

/**
 * Resolver functions for transaction queries.
 * @type {TransactionQueries}
 */
const transactionQueries = {
    getListTransactionByAdmin: async (parent, args, context, info) => {
        try {
            const transaction = await prisma.transaction.findMany({
                take: args.filter.pageSize,
                skip: (args.filter.currentPage - 1) * args.filter.pageSize,
                orderBy: {
                    created_at: 'desc',
                },
            })
            // get detail children 
            for (let i = 0; i < transaction.length; i++) {
                const children = await prisma.children.findUnique({
                    where: {
                        id: transaction[i].children_id
                    }
                })
                transaction[i].children_name = children.username
            }
            // get detail course
            for (let i = 0; i < transaction.length; i++) {
                const course = await prisma.course.findUnique({
                    where: {
                        id: transaction[i].course_id
                    }
                })
                transaction[i].course_name = course.title
            }
            // get total page
            const totalPage = Math.ceil(await prisma.transaction.count() / args.filter.pageSize);
            log.info(`getListTransactionByAdmin: ${transaction.length} transactions`)

            return {
                transaction,
                info: {
                    totalPage: totalPage,
                    currentPage: args.filter.currentPage,
                    pageSize: args.filter.pageSize
                }
            }
        } catch (error) {
            log.error(`getListTransactionByAdmin: ${error.message}`)
            global.Sentry.captureException(error)
            return []
        }
    },

    getListTransactionByParent: async (parent, args, context, info) => {
        try {
            // get list children by user
            const listChildren = await prisma.children.findMany({
                where: {
                    parent_id: args.parent_id
                }
            })
            // loop list children to get list transaction
            let transaction = []
            for (const children of listChildren) {
                const listTransaction = await prisma.transaction.findMany({
                    where: {
                        children_id: children.id
                    },
                    orderBy: {
                        created_at: 'desc',
                    }
                });
                // get detail course
                for (let i = 0; i < listTransaction.length; i++) {
                    const course = await prisma.course.findUnique({
                        where: {
                            id: listTransaction[i].course_id
                        }
                    })
                    listTransaction[i].course_name = course.title
                    listTransaction[i].children_name = children.username
                }
                transaction = transaction.concat(listTransaction)
            }
            // get total page
            const totalPage = Math.ceil(transaction.length / args.filter.pageSize);
            transaction = transaction.slice((args.filter.currentPage - 1) * args.filter.pageSize, args.filter.currentPage * args.filter.pageSize)
            return {
                transaction,
                info: {
                    totalPage: totalPage,
                    currentPage: args.filter.currentPage,
                    pageSize: args.filter.pageSize
                }
            }
        } catch (error) {
            log.error(`getListTransactionByParent: ${error.message}`)
            global.Sentry.captureException(error)
            return []
        }
    },
}

module.exports = transactionQueries
