const { PrismaClient } = require('@prisma/client')
const log = require('../../../services/logger.service')('certificateMutations')
const prisma = new PrismaClient()

const certificateMutations = {
    getListCertificateByChildrenId: async (parent, args, context, info) => {
        try {
            const result = await prisma.certificate.findMany({
                where: {
                    children_id: args.children_id,
                },
            })
            // define course
            let course = []
            // get detail course
            for (let i = 0; i < result.length; i++) {
                course.push(
                    await prisma.course.findUnique({
                        where: {
                            id: result[i].course_id,
                        },
                    })
                )
            }
            // get detail children
            const children = await prisma.children.findUnique({
                where: {
                    id: args.children_id,
                },
            })
            log.info(`Get list certificate by children id: ${args.children_id}`)
            return {
                children: children,
                course: course,
            }
        } catch (error) {
            log.error(error)
            global.Sentry.captureException(error)
            throw new Error('Error getting list certificate')
        }
    },
}

module.exports = certificateMutations
