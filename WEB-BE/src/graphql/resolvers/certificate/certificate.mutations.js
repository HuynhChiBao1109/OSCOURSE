const { PrismaClient } = require('@prisma/client')
const log = require('../../../services/logger.service')('certificateMutations')
const prisma = new PrismaClient()
const notification = require('../../../services/notification.service');
const { sendMail } = require('../../../helpers/mail.helper');

const certificateMutations = {
    createCertificate: async (parent, args, context, info) => {
        try {
            const certificate = await prisma.certificate.create(
                {
                    data: {
                        course_id: args.course_id,
                        children_id: args.children_id,
                        created_at: new Date(),
                    }
                }
            )
            log.info(`Certificate created: ${certificate.id}`)
            // get course detail
            const courseDetail = await prisma.course.findUnique({
                where: {
                    id: args.course_id
                }
            })
            // get parent info
            const childrenInfo = await prisma.children.findUnique({
                where: {
                    id: args.children_id
                }
            })
            const parentInfo = await prisma.user.findUnique({
                where: {
                    id: childrenInfo.parent_id
                }
            })
            // send notification
            await notification.sendNotification(
                `Congratulations! You have successfully completed ${courseDetail.title}.`,
                args.children_id
            )
            // send mail to parent
            await sendMail(
                parentInfo.email,
                'Certificate Issued',
                `Congratulations! Your child ${childrenInfo.name} has successfully completed the course ${courseDetail.title}.`
            )
            return certificate
        } catch (error) {
            log.error(error)
            global.Sentry.captureException(error)
            throw new Error('Error creating certificate')
        }
    }
}

module.exports = certificateMutations
