const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const log = require('../../../services/logger.service')('CommentQueries')

const commentQueries = {
    getListCommentByCourse: async (parent, args, context, info) => {
        try {
            const result = await prisma.comment.findMany({
                where: {
                    course_id: args.course_id,
                },
            })
            // get user info
            for (let i = 0; i < result.length; i++) {
                result[i].user = await prisma.user.findUnique({
                    where: {
                        id: result[i].user_id,
                    },
                })
                log.info(`commentQueries.getListCommentByCourse: ${result[i].user}`)
            }

            log.info('commentQueries.comment')
            return result
        } catch (error) {
            log.error(error)
            global.Sentry.captureException(error)
            throw new Error(error)
        }
    },
}

module.exports = commentQueries
