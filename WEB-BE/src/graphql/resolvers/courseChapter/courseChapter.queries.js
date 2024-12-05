const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const log = require('../../../services/logger.service')('CourseChapterQueries')
const {
    requireAuthen,
} = require('../../../middlewares/authentication.middleware')
const jwt = require('../../../utils/jwt.util')()

/**
 * Queries for retrieving course chapter details.
 * @typedef {Object} courseChapterQueries
 */
const courseChapterQueries = {
    getDetailCourseChapter: async (parent, args, context, info) => {
        try {
            const token = context.headers.authorization
            const courseChapter = await prisma.courseChapter
                .findUnique({
                    where: {
                        id: args.id,
                    },
                })
                .catch((error) => console.error(error))
            // get list lesson
            const lessons = await prisma.courseLesson.findMany({
                where: {
                    course_chapter_id: args.id,
                },
                orderBy: {
                    lesson_order: 'asc',
                },
            })
            for (let i = 0; i < lessons.length; i++) {
                lessons[i].isOpen = false
            }
            // check role of user + check can open lesson
            if (token) {
                const user = await jwt.verifyToken(token)
                console.log(user)
                if (user.role === 'admin' || user.role === 'superAdmin') {
                    // set default status for lesson
                    for (let i = 0; i < lessons.length; i++) {
                        lessons[i].isOpen = true
                    }
                } else if (user.role === 'children') {
                    const collectionOfChildren = await prisma.collection.findFirst({
                        where: {
                            course_id: courseChapter.course_id,
                            children_id: user.id,
                        },
                    })
                    if (collectionOfChildren) {
                        const progressCourse = await prisma.progressCourse.findFirst({
                            where: {
                                children_id: user.id,
                            }
                        })
                        console.log(`progressCourse`, progressCourse)
                        // get detail of course_chapter_id base on progress coruse
                        const courseChapterProgress = await prisma.courseChapter.findFirst({
                            where: {
                                id: progressCourse.course_chapter_id,
                            },
                        })
                        // get detail of course_lesson id base on progress coruse
                        const courseLessonProgress = await prisma.courseLesson.findFirst({
                            where: {
                                id: progressCourse.course_lesson_id,
                            },
                        })
                        // get chapter lesson of children
                        if (courseChapterProgress.chapter_order > courseChapter.chapter_order) {
                            for (let i = 0; i < lessons.length; i++) {
                                lessons[i].isOpen = true
                            }
                        } else if (courseChapterProgress.chapter_order === courseChapter.chapter_order) {
                            for (let i = 0; i < lessons.length; i++) {
                                if (lessons[i].lesson_order <= courseLessonProgress.lesson_order) {
                                    lessons[i].isOpen = true
                                }
                            }
                        }
                    }
                }

            }

            courseChapter.lessons = lessons
            return courseChapter
        } catch (error) {
            log.error(error)
            global.Sentry.captureException(error)
            throw new Error(error)
        }
    },
}

module.exports = courseChapterQueries
