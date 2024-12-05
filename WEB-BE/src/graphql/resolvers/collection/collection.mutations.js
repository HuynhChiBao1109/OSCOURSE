const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const log = require('../../../services/logger.service')('CollectionQueries')

const collectionMutations = {
    addUserCollectionToCourse: async (parent, args, context, info) => {
        try {
            // check if user already have this course
            const isExistUser = await prisma.collection.findFirst({
                where: {
                    children_id: args.children_id,
                    course_id: args.course_id
                }
            })
            if (isExistUser) {
                throw new Error('User already have this course')
            }
            // create new collection
            const collection = await prisma.collection.create({
                data: {
                    children_id: args.children_id,
                    course_id: args.course_id,
                    status: 'active'
                }
            })
            // get list chapter order by chapter_order
            const chapters = await prisma.chapter.findMany({
                where: {
                    course_id: args.course_id
                },
                orderBy: {
                    chapter_order: 'asc'
                }
            })
            // get list lesson order by lesson_order
            const lessons = await prisma.lesson.findMany({
                where: {
                    course_chapter_id: args.chapters[0].id
                },
                orderBy: {
                    lesson_order: 'asc'
                }
            })
            // get detail course
            const course = await prisma.course.findFirst({
                where: {
                    id: args.course_id
                }
            })
            // get time_available of course and add to now base on month
            const expired_at = addMonthsToDate(new Date(), course.time_available)
            // create new progress
            const progress = await prisma.progressCourse.create({
                data: {
                    children_id: args.children_id,
                    course_id: args.course_id,
                    course_chapter_id: chapters[0].id,
                    course_lesson_id: lessons[0].id,
                    created_at: new Date(),
                    expired_at: expired_at
                }
            })
            // get frist chapter and lesson of course
            // send notification
        } catch (error) {
            log.error('addUserCollectionToCourse', error)
            global.Sentry.captureException(error)
            throw new Error('Failed to add user collection to course', error)
        }
    }
}

function addMonthsToDate(date, months) {
    try {
        // Create a copy of the original date to avoid modifying it directly
        const newDate = new Date(date.getTime());

        // Get the current month (0-indexed)
        const currentMonth = newDate.getMonth();

        // Add the desired months
        newDate.setMonth(currentMonth + months);

        // Handle overflowing months (e.g., December + 3 becomes March of next year)
        if (newDate.getMonth() !== (currentMonth + months) % 12) {
            newDate.setFullYear(newDate.getFullYear() + 1);
        }

        // Return the modified date
        return newDate;
    } catch (error) {
        log.error('addMonthsToDate', error)
        global.Sentry.captureException(error)
        throw new Error('Failed to add months to date', error)
    }
}

module.exports = collectionMutations
