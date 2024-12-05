const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const log = require('../../../services/logger.service')('CourseQueries')

const courseQueries = {
    getListCourse: async (parent, args, context, info) => {
        try {
            const course = await prisma.course.findMany({
                take: args.filter.pageSize,
                skip: (args.filter.currentPage - 1) * args.filter.pageSize,
                where: {
                    title: {
                        contains: args.filter.searchName,
                    },
                    category: {
                        equals: args.filter.category,
                    },
                    status: {
                        equals: 'active',
                    },
                },
            })
            // get total page
            const totalField = await prisma.course.count({
                where: {
                    title: {
                        contains: args.filter.searchName,
                    },
                    category: {
                        equals: args.filter.category,
                    },
                    status: {
                        equals: 'active',
                    },
                },
            })
            const totalPage = Math.ceil(totalField / args.filter.pageSize)

            return {
                course,
                info: {
                    totalPage: totalPage,
                    currentPage: args.filter.currentPage,
                    pageSize: args.filter.pageSize,
                },
            }
        } catch (error) {
            log.error(error)
            global.Sentry.captureException(error)
            throw new Error(error)
        }
    },

    getDetailCourse: async (parent, args, context, info) => {
        try {
            const { id, user_id } = args
            const result = await prisma.course.findUnique({
                where: {
                    id: id,
                },
            })
            result.status = 'inActive'
            // check user_id have collected this course
            if (user_id) {
                const collected = await prisma.collection.findFirst({
                    where: {
                        user_id: user_id,
                        course_id: id,
                        status: 'active',
                    },
                })
                if (collected) {
                    result.status = 'active'
                }
            }
            // get course chapter
            const chapter = await prisma.courseChapter
                .findMany({
                    where: {
                        course_id: args.id,
                    },
                    orderBy: {
                        chapter_order: 'asc',
                    },
                })
                .catch((error) => console.error(error))
            // get chapter lesson
            result.chapter = chapter
            return result
        } catch (error) {
            log.error(error)
            global.Sentry.captureException(error)
            throw new Error(error)
        }
    },

    getListCourseByAdmin: async (parent, args, context, info) => {
        try {
            const course = await prisma.course.findMany({
                take: args.filter.pageSize,
                skip: (args.filter.currentPage - 1) * args.filter.pageSize,
                where: {
                    title: {
                        contains: args.filter.searchName,
                    },
                    category: {
                        equals: args.filter.category,
                    },
                },
            })
            // get total page
            const totalField = await prisma.course.count({
                where: {
                    title: {
                        contains: args.filter.searchName,
                    },
                    category: {
                        equals: args.filter.category,
                    },
                },
            })
            const totalPage = Math.ceil(totalField / args.filter.pageSize)

            return {
                course,
                info: {
                    totalPage: totalPage,
                    currentPage: args.filter.currentPage,
                    pageSize: args.filter.pageSize,
                },
            }
        } catch (error) {
            log.error(error)
            global.Sentry.captureException(error)
            throw new Error(error)
        }
    }
}

module.exports = courseQueries
