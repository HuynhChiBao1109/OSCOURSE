const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const log = require('../../../services/logger.service')('CourseMutations')
const notificationService = require('../../../services/notification.service')

const courseMutations = {
    createCourse: async (parent, args, context, info) => {
        try {
            const checkCourseIsExist = await prisma.course.findFirst({
                where: {
                    title: args.course.title,
                },
            })
            if (checkCourseIsExist) {
                throw new Error('Course is already exist')
            }

            const result = await prisma.course
                .create({
                    data: {
                        title: args.course.title,
                        price: args.course.price,
                        discount: 0,
                        description: args.course.description,
                        total_student_join: 0,
                        category: args.course.category,
                        created_at: new Date(),
                        updated_at: new Date(),
                        time_available: args.course.time_available,
                        thumbnail: args.course.thumbnail,
                        status: 'active',
                    },
                })
                .catch((error) => console.error(error))
            // send notification to all user
            const message = `New course ${args.course.title} is ready available now!`
            await notificationService.sendNotification(message, 'All')
            // create a certificate base on title
            return result
        } catch (error) {
            log.error(error)
            global.Sentry.captureException(error)
            throw new Error(error)
        }
    },

    updateCourse: async (parent, args, context, info) => {
        try {
            const result = await prisma.course
                .update({
                    where: {
                        id: args.course.id,
                    },
                    data: {
                        title: args.course.title,
                        price: args.course.price,
                        discount: args.course.discount,
                        description: args.course.description,
                        total_student_join: args.course.total_student_join,
                        category: args.course.category,
                        updated_at: new Date(),
                        time_available: args.course.time_available,
                        thumbnail: args.course.thumbnail,
                        status: args.course.status,
                    },
                })
                .catch((error) => console.error(error))
            return result
        } catch (error) {
            log.error(error)
            global.Sentry.captureException(error)
            throw new Error(error)
        }
    },

    deleteCourse: async (parent, args, context, info) => {
        try {
            const result = await prisma.course
                .update({
                    where: {
                        id: args.id,
                    },
                    data: {
                        status: 'inactive',
                    },
                })
                .catch((error) => console.error(error))
            return result
        } catch (error) {
            log.error(error)
            global.Sentry.captureException(error)
            throw new Error(error)
        }
    },
}

module.exports = courseMutations
