const log = require('../services/logger.service')('PaymentService')
const { PrismaClient } = require('@prisma/client')
const time = require('../helpers/timestamp.helper')
const { sendMail } = require('../helpers/mail.helper')

class PaymentService {
    async excute(data) {
        log.info('Processing payment data...')
        const client = new PrismaClient()

        // get transaction details from the data received
        data.forEach((dt) => {
            // handle logic for each data
            // regex to get description format (?<=CUSTOMER\s)(.*?)(?=\s-)
            const description = dt.description.match(
                /(?<=CUSTOMER\s)(.*?)(?=\s-)/
            )[0]
            log.info(`Description: ${description}`)
            const amount = dt.amount
            if (amount) {
                // fetch transaction details from database
                client.transaction
                    .findUnique({
                        where: {
                            amount: amount,
                            transaction_code: description,
                            status: 'pending',
                        },
                    })
                    .then(async (transaction) => {
                        if (transaction) {
                            log.info(`Transaction found: ${transaction}`)
                            // create a collection for children
                            await client.collection.create({
                                data: {
                                    course_id: transaction.course_id,
                                    children_id: transaction.children_id,
                                },
                            })
                            // get first chapter and lesson
                            const firstChapter =
                                await client.courseChapter.findFirst({
                                    where: {
                                        course_id: transaction.course_id,
                                    },
                                    orderBy: {
                                        chapter_order: 'asc',
                                    },
                                })
                            const firstLesson =
                                await client.courseLesson.findFirst({
                                    where: {
                                        course_chapter_id: firstChapter.id,
                                    },
                                    orderBy: {
                                        lesson_order: 'asc',
                                    },
                                })
                            // get available course
                            const course = await client.course.findFirst({
                                where: {
                                    id: transaction.course_id,
                                },
                            })
                            // update total_student_join in course
                            await client.course.update({
                                where: {
                                    id: transaction.course_id,
                                },
                                data: {
                                    total_student_join:
                                        course.total_student_join + 1,
                                },
                            })
                            // create a progress for children
                            await client.progressCourse.create({
                                data: {
                                    course_chapter_id: firstChapter.id,
                                    course_lesson_id: firstLesson.id,
                                    course_id: transaction.course_id,
                                    children_id: transaction.children_id,
                                    created_at: new Date(),
                                    expired_at: time.addMonthsToDate(
                                        new Date(),
                                        course.time_available
                                    ),
                                },
                            })
                            // update status transaction to success
                            await client.transaction.update({
                                where: {
                                    id: transaction.id,
                                },
                                data: {
                                    status: 'success',
                                },
                            })
                        } else {
                            log.error('Transaction not found')
                        }
                    })
                    .catch((error) => {
                        log.error(`Error: ${error.message}`)
                        global.Sentry.captureException(error)
                    })
            }
        })
    }
}
module.exports = () => {
    return new PaymentService()
}
