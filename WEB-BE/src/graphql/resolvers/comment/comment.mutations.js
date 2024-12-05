const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const log = require('../../../services/logger.service')('CommentMutations')
const notificationService = require('../../../services/notification.service')
const jwt = require('../../../utils/jwt.util');

const commentMutaions = {
    createComment: async (parent, args, context, info) => {
        try {
            const result = await prisma.comment.create({
                data: {
                    user_id: args.comment.user_id,
                    course_id: args.comment.course_id,
                    description: args.comment.description,
                    parent_comment: args.comment.parent_comment,
                },
            })
            log.info('Create Comment', JSON.stringify(result))
            let user;
            // get detail parent comment
            const parentComment = await prisma.comment.findUnique({
                where: {
                    id: args.comment.parent_comment,
                },
            })
            if (parentComment) {
                let user_parent_comment = await prisma.user.findUnique({
                    where: {
                        id: parentComment.user_id,
                    },
                })
                // get user
                user = await prisma.user.findUnique({
                    where: {
                        id: args.comment.user_id,
                    },
                })
                if (!user) {
                    user = await prisma.children.findUnique({
                        where: {
                            id: parentComment.user_id,
                        },
                    })
                }
                // send notification to user
                const message = `${user.name} has replied to your comment`
                await notificationService.sendNotification(message, user_parent_comment.name)
            }

            return result
        } catch (error) {
            log.error('Create Comment', error)
            global.Sentry.captureException(error)
            throw new Error('Failed to create comment')
        }
    },

    deleteComment: async (parent, args, context, info) => {
        // const token = context.headers.authorization;
        // const user = jwt.decodeToken(token);
        // test eviroment
        const result = await prisma.comment.delete({
            where: {
                id: args.id,
            },
        })
        log.info('Delete Comment', JSON.stringify(result))
        return result

        // logic 
        // if (user.role === 'admin' || user.role === 'superadmin') {
        //     const result = await prisma.comment.delete({
        //         where: {
        //             id: args.id,
        //         },
        //     })
        //     log.info('Delete Comment', JSON.stringify(result))
        //     return result

        // }
        // // check user is owner of comment
        // const commentDetail = await prisma.comment.findUnique({
        //     where: {
        //         id: args.id,
        //     },
        // })
        // if (user.id === commentDetail.user_id) {
        //     const result = await prisma.comment.delete({
        //         where: {
        //             id: args.id,
        //         },
        //     })
        //     log.info('Delete Comment', JSON.stringify(result))
        //     return result
        // }

        // throw new Error('You are not owner of this comment')
    },
}

module.exports = commentMutaions
