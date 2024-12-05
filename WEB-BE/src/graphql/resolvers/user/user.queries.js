const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const log = require('../../../services/logger.service')('UserQueries')
const {
    requireAuth,
} = require('../../../middlewares/authentication.middleware')
/**
 * Contains resolver functions for user queries.
 * @typedef {Object} userQueries
 */
const userQueries = {
    /**
     * Retrieves a list of users based on the provided filter.
     * @param {any} parent - The parent object.
     * @param {Object} args - The arguments passed to the resolver.
     * @param {Object} context - The context object.
     * @param {Object} info - The information about the execution.
     * @returns {Promise<Object>} - The list of users and pagination information.
     */
    getListUser: async (parent, args, context, info) => {
        try {
            // await requireAuth('ROLE', context) // Require user to be authenticated
            const result = await prisma.user.findMany({
                take: args.filter.pageSize,
                skip: (args.filter.currentPage - 1) * args.filter.pageSize,
                where: {
                    role: {
                        equals: args.filter.role,
                    },
                    name: {
                        contains: args.filter.searchName,
                    },
                },
            })
            // fintotal page
            const totalUser = await prisma.user.count({
                where: {
                    role: {
                        equals: args.filter.role,
                    },
                    name: {
                        contains: args.filter.searchName,
                    },
                },
            })
            // total page
            const totalPage = Math.ceil(totalUser / args.filter.pageSize)

            return {
                user: result,
                info: {
                    totalPage: totalPage,
                    currentPage: args.filter.currentPage,
                    pageSize: args.filter.pageSize,
                },
            }
        } catch (error) {
            log.error(`getListUser: ${error.message}`)
            global.Sentry.captureException(error)
            return []
        }
    },

    /**
     * Retrieves a user by their ID.
     * @param {any} parent - The parent object.
     * @param {Object} args - The arguments passed to the resolver.
     * @returns {Promise<Object>} - The user object.
     */
    user: async (parent, args) => {
        const result = await prisma.user.findUnique({
            where: {
                id: args.id,
            },
        })
        return result
    },

    /**
     * Retrieves a list of children by their parent's ID.
     * @param {any} parent - The parent object.
     * @param {Object} args - The arguments passed to the resolver.
     * @returns {Promise<Array>} - The list of children.
     */
    getListChildrenByParentId: async (parent, args) => {
        try {
            const children = await prisma.children.findMany({
                where: {
                    parent_id: args.parent_id,
                },
            })
            return children
        } catch (error) {
            log.error(`getListChildrenByParentId: ${error.message}`)
            global.Sentry.captureException(error)
            return []
        }
    },
}

module.exports = userQueries
