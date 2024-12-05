const { PrismaClient } = require('@prisma/client')
const log = require('../../../services/logger.service')('CourseLessonMutations')

const prisma = new PrismaClient()

/**
 * Object containing resolver functions for course lesson mutations.
 *
 * @typedef {Object} courseLessonMutation
 * @property {Function} createCourseLesson - Creates a new course lesson.
 * @property {Function} createVideoLesson - Creates a video lesson for a course.
 * @property {Function} createQuizLesson - Creates a quiz lesson for a course.
 */
const courseLessonMutation = {
    createCourseLesson: async (parent, args, context, info) => {
        try {
            const { courseLesson } = args

            // Check lesson_order
            const lessonOrder = await prisma.courseLesson.findFirst({
                where: {
                    course_chapter_id: courseLesson.course_chapter_id,
                    lesson_order: courseLesson.lesson_order,
                },
            })
            if (lessonOrder) {
                throw new Error('Lesson order already exists')
            }

            courseLesson.video_id = 'No Video Available'
            courseLesson.quiz = []
            courseLesson.pass_condition = 0

            const result = await prisma.courseLesson
                .create({
                    data: {
                        course_chapter_id: courseLesson.course_chapter_id,
                        type_lesson: courseLesson.type_lesson,
                        video_id: courseLesson.video_id,
                        lesson_order: courseLesson.lesson_order,
                        quiz: courseLesson.quiz,
                        pass_condition: courseLesson.pass_condition,
                        time_expect: courseLesson.time_expect,
                        lesson_name: courseLesson.lesson_name,
                    },
                })
                .catch((error) => {
                    log.error(error)
                    throw new Error(error)
                })

            log.info('courseLessons', result)
            return result
        } catch (error) {
            log.error('createCourseLesson', error)
            global.Sentry.captureException(error)
            throw new Error('Failed to create course lesson', error)
        }
    },

    createVideoLesson: async (parent, args, context, info) => {
        try {
            const { course_chapter_id, course_id, lession_id } = args.videoLesson
            const video_id = `${course_id}/${course_chapter_id}/${lession_id}`

            // Update video_id
            const courseLesson = await prisma.courseLesson
                .update({
                    where: {
                        id: lession_id,
                    },
                    data: {
                        video_id,
                    },
                })
                .catch((error) => log.error(error))

            // Make signed url
            const signedUrl = new Promise((resolve, reject) => {
                require('../../../dbs/supabase.db')()
                    .init()
                    .then((supabase) => {
                        supabase.storage
                            .from('CourseVideos')
                            .createSignedUploadUrl(video_id)
                            .then(({ data, error }) => {
                                if (error) {
                                    global.Sentry.captureException(error)
                                    log.error(error)
                                    reject(error)
                                }
                                resolve(data)
                            })
                    })
            })

            return {
                courseLesson,
                signedUrl,
            }
        } catch (error) {
            log.error('createVideoLesson', error)
            global.Sentry.captureException(error)
            throw new Error('Failed to create video lesson', error)
        }
    },

    createQuizLesson: async (parent, args, context, info) => {
        try {
            // Update quiz
            const courseLesson = await prisma.courseLesson
                .update({
                    where: {
                        id: args.quizLesson.id,
                    },
                    // push quiz
                    data: {
                        quiz: {
                            push: args.quizLesson.quiz,
                        },
                        pass_condition: args.quizLesson.pass_condition,
                    },
                })

            log.info('createQuizLesson', courseLesson)

            return courseLesson
        } catch (error) {
            log.error('createQuizLesson', error)
            global.Sentry.captureException(error)
            throw new Error('Failed to create quiz lesson', error)
        }
    },

    deleteCourseLesson: async (parent, args, context, info) => {
        try {
            const isDeleteLesson = await prisma.courseLesson.delete({
                where: {
                    id: args.course_lesson_id,
                },
            })

            log.info('deleteCourseLesson', isDeleteLesson)
            return `Course lesson with id ${args.course_lesson_id} has been deleted successfully`
        } catch (error) {
            log.error('deleteCourseLesson', error)
            global.Sentry.captureException(error)
            throw new Error('Failed to delete course lesson', error)
        }
    },

    updateCourseLessonQuiz: async (parent, args, context, info) => {
        try {
            const courseLesson = await prisma.courseLesson
                .update({
                    where: {
                        id: args.quizLesson.course_lesson_id,
                    },
                    data: {
                        quiz: {
                            set: args.quizLesson.quiz,
                        },
                        pass_condition: args.quizLesson.pass_condition,
                    },
                })
            return courseLesson;
        } catch (error) {
            log.error('updateCourseLessonQuiz', error)
            global.Sentry.captureException(error)
            throw new Error('Failed to update course lesson quiz', error)
        }
    },

    updateLesson: async (parent, args, context, info) => {
        try {
            const result = await prisma.courseLesson.update({
                where: {
                    id: args.lesson.id,
                },
                data: {
                    lesson_name: args.lesson.lesson_name,
                },
            })
            return result;
        } catch (error) {
            log.error('updateLesson', error)
            global.Sentry.captureException(error)
            throw new Error('Failed to update lesson', error)
        }
    }
}

module.exports = courseLessonMutation
