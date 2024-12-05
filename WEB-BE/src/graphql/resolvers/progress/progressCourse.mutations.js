const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const log = require('../../../services/logger.service')(
    'ProgressCourseMutations'
)
const notificationService = require('../../../services/notification.service')

/**
 * Mutation resolver for catching event pass lesson.
 *
 * @param {Object} parent - The parent object.
 * @param {Object} args - The arguments passed to the resolver.
 * @param {Object} context - The context object.
 * @param {Object} info - The info object.
 * @returns {Promise<Object>} - The updated progress course object.
 */
const progressCourseQueries = {
    catchEventPassLesson: async (parent, args, context, info) => {
        const result = await prisma.progressCourse.update({
            where: {
                course_id: args.progressCourse.course_id,
                children_id: args.progressCourse.children_id,
            },
            data: {
                course_chapter_id: args.progressCourse.course_chapter_id,
                course_lesson_id: args.progressCourse.course_lesson_id,
            },
        })
        // get detail lesson
        const lesson = await prisma.lesson.findUnique({
            where: {
                id: args.progressCourse.lesson_id,
            },
        })
        const message = `You have passed lesson ${lesson.lesson_name}`
        await notificationService.sendNotification(
            message,
            args.progressCourse.children_id
        )
        return result
    },
}

module.exports = progressCourseQueries
