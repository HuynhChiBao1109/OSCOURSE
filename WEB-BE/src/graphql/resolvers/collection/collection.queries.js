const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const log = require('../../../services/logger.service')('CollectionQueries')

const collectionQueries = {
    getCollectionByChildrenId: async (parent, args, context, info) => {
        try {
            const collection = await prisma.collection.findMany({
                where: {
                    children_id: args.children_id,
                },
            })
            for (let i = 0; i < collection.length; i++) {
                const courseDetail = await prisma.course.findUnique({
                    where: {
                        id: collection[i].course_id,
                    },
                });
                collection[i].course = courseDetail
            }
            return collection
        } catch (error) {
            log.error(error)
            global.Sentry.captureException(error)
            throw new Error(error)
        }
    },

    getListChildrenByCourseId: async (parent, args, context, info) => {
        try {
            const collection = await prisma.collection.findMany({
                take: args.filter.pageSize,
                skip: (args.filter.currentPage - 1) * args.filter.pageSize,
                where: {
                    course_id: args.course_id,
                },
            })
            collection.children = []
            // get children detail
            for (const collect of collection) {
                collect.children.push(
                    await prisma.children.findUnique({
                        where: {
                            id: collection.childrenId,
                        },
                    })
                )
            }
            // get total page 
            const totalPage = await prisma.collection.count({
                where: {
                    courseId: args.courseId,
                },
            })
            collection.totalPage = Math.ceil(totalPage / args.filter.pageSize)
            collection.currentPage = args.filter.currentPage
            collection.pageSize = args.filter.pageSize
            return collection
        } catch (error) {
            log.error(error)
            global.Sentry.captureException(error)
            throw new Error(error)
        }
    }
}

module.exports = collectionQueries
