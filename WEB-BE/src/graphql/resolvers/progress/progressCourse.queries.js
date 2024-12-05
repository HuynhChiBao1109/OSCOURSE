const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const log = require('../../../services/logger.service')('ProgressCourseQueries')

/**
 * Queries for progressCourse.
 * @typedef {Object} progressCourseQueries
 * @property {Function} getListProgressCourse - Retrieves a list of progress courses.
 * @property {Function} getDetailProgressCourseByUser - Retrieves the progress course details for a specific user.
 */
const progressCourseQueries = {
    getListProgressCourse: async (parent, args, context, info) => {
        const result = await prisma.progressCourse.findMany()
        return result
    },

    getDetailProgressCourseByUser: async (parent, args, context, info) => {
        // find by user_id
        const result = await prisma.progressCourse.findMany({
            where: {
                children_id: args.children_id,
            },
        })
        return result
    },
}

module.exports = progressCourseQueries
