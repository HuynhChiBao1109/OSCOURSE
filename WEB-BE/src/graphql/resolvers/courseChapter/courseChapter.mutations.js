const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const log = require('../../../services/logger.service')(
    'CourseChapterMutations'
)

/**
 * Mutations for course chapters.
 *
 * @typedef {Object} courseChapterMutations
 * @property {Function} createCourseChapter - Creates a new course chapter.
 * @property {Function} updateCourseChapter - Updates an existing course chapter.
 */
const courseChapterMutations = {
    createCourseChapter: async (parent, args, context, info) => {
        try {
            // check chapter order exist
            const chapterOrderExist = await prisma.courseChapter.findFirst({
                where: {
                    course_id: args.courseChapter.course_id,
                    chapter_order: args.courseChapter.chapter_order,
                },
            })
            if (chapterOrderExist) {
                log.error('createCourseChapter', 'Chapter order already exist')
                throw new Error('Chapter order already exist')
            }
            // create course chapter
            const result = await prisma.courseChapter.create({
                data: {
                    course_id: args.courseChapter.course_id,
                    chapter_name: args.courseChapter.chapter_name,
                    chapter_order: args.courseChapter.chapter_order,
                },
            })
            log.info('createCourseChapter', result)
            return result
        } catch (error) {
            log.error('createCourseChapter', error)
            global.Sentry.captureException(error)
            throw new Error('Failed to create course chapter', error)
        }
    },

    updateCourseChapter: async (parent, args, context, info) => {
        try {
            // check chapter order exist
            const chapterOrderExist = await prisma.courseChapter.findFirst({
                where: {
                    chapter_order: args.courseChapter.chapter_order,
                    course_id: args.courseChapter.course_id,
                },
            })

            if (chapterOrderExist) {
                if (chapterOrderExist.id !== args.courseChapter.id) {
                    log.error('updateCourseChapter', 'Chapter order already exist')
                    throw new Error('Chapter order already exist')
                } else {
                    const result = await prisma.courseChapter.update({
                        where: {
                            id: args.courseChapter.id,
                            course_id: args.courseChapter.course_id,
                        },
                        data: {
                            chapter_name: args.courseChapter.chapter_name,
                            chapter_order: args.courseChapter.chapter_order,
                            course_id: args.courseChapter.course_id,
                        },
                    })
                    return result
                }
            } else {
                const result = await prisma.courseChapter.update({
                    where: {
                        id: args.courseChapter.id,
                        course_id: args.courseChapter.course_id,
                    },
                    data: {
                        chapter_name: args.courseChapter.chapter_name,
                        chapter_order: args.courseChapter.chapter_order,
                    },
                })
                return result
            }
        } catch (error) {
            log.error('updateCourseChapter', error)
            global.Sentry.captureException(error)
            throw new Error('Failed to update course chapter', error)
        }
    },

    deleteCourseChapter: async (parent, args, context, info) => {
        try {
            const isDeleteChapter = await prisma.courseChapter.delete({
                where: {
                    id: args.course_chapter_id,
                }
            });
            // delete all lesson include
            await prisma.lesson.deleteMany({
                where: {
                    course_chapter_id: args.course_chapter_id
                }
            });
            log.info('deleteCourseChapter', isDeleteChapter)
            return `Course chapter with id ${args.course_chapter_id} has been deleted successfully`
        } catch (error) {
            log.error('deleteCourseChapter', error)
            global.Sentry.captureException(error)
            throw new Error('Failed to delete course chapter', error)
        }
    }
}

module.exports = courseChapterMutations
