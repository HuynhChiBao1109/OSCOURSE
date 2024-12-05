const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const log = require('../../../services/logger.service')('UserMutations')
const {
    requireAuth,
} = require('../../../middlewares/authentication.middleware')
const bcrypt = require('bcrypt')
const { sendMail } = require('../../../helpers/mail.helper')

/**
 * Object containing GraphQL mutations for user operations.
 *
 * @typedef {Object} userMutations
 * @property {Function} createUser - Creates a new user.
 * @property {Function} updateUser - Updates an existing user.
 * @property {Function} deleteUser - Deletes a user by setting their status to 'inActive'.
 * @property {Function} changePassWordByUser - Changes the password of a user.
 * @property {Function} checkChildrenUserNameExist - Checks if a children's username and parent's email already exist.
 */
const userMutations = {
    createUser: async (parent, args) => {
        try {
            // check use already exists
            const checkExistUser = await prisma.user.findUnique({
                where: {
                    email: args.user.email,
                },
            })

            if (checkExistUser) {
                throw new Error('User already exists')
            }
            // hash password
            const hashPassword = await new Promise((resolve, reject) => {
                bcrypt.hash(args.user.password, 8, (err, hash) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(hash)
                })
            })

            const result = await prisma.user.create({
                data: {
                    name: args.user.name,
                    email: args.user.email,
                    password: hashPassword,
                    role: args.user.role,
                    status: args.user.status,
                    date_of_birth: args.user.date_of_birth,
                    phone: args.user.phone,
                    avatar: args.user.avatar,
                    gender: args.user.gender,
                },
            })
            result.password = 'secret'
            // send mail
            await sendMail(
                args.user.email,
                'Welcome to OSCOURSE',
                'You have successfully registered an account on OSCOURSE'
            )
            log.info(`createUser: ${JSON.stringify(result)}`)
            return result
        } catch (error) {
            log.error(error)
            global.Sentry.captureException(error)
            throw new Error(error)
        }
    },

    updateUser: async (parent, args, contex, info) => {
        try {
            const result = await prisma.user.update({
                where: {
                    id: args.user.id,
                },
                data: {
                    name: args.user.name,
                    date_of_birth: args.user.date_of_birth,
                    phone: args.user.phone,
                    avatar: args.user.avatar,
                    gender: args.user.gender,
                },
            })
            log.info(`updateUser: ${JSON.stringify(result)}`)
            return result
        } catch (error) {
            log.error(error)
            global.Sentry.captureException(error)
            throw new Error(error)
        }
    },

    deleteUser: async (parent, args) => {
        try {
            const result = await prisma.user.update({
                where: {
                    id: args.id,
                },
                data: {
                    status: 'inActive',
                },
            })
            log.info(`deleteUser: ${JSON.stringify(result)}`)
            return result
        } catch (error) {
            log.error(error)
            global.Sentry.captureException(error)
            throw new Error(error)
        }
    },

    // upadateUserByAdmin: async (parent, args) => {
    //     const result = await prisma.user.update({
    //         where: {
    //             id: args.user.id,
    //         },
    //         data: {
    //             name: args.user.name,
    //             date_of_birth: args.user.date_of_birth,
    //             phone: args.user.phone,
    //             avatar: args.user.avatar,
    //             email: args.user.email,
    //             role: args.user.role,
    //             status: args.user.status,
    //             gender: args.user.gender
    //         }
    //     })

    //     return result
    // },

    changePassWordByUser: async (parent, args, context, info) => {
        const hashPassword = await bcrypt.hash(args.password, 8)
        const result = await prisma.user.update({
            where: {
                id: args.id,
            },
            data: {
                password: hashPassword,
            },
        })
        result.password = 'secret'
        return result
    },

    checkChildrenUserNameExist: async (parent, args, context, info) => {
        try {
            const childrenInfor = await prisma.children.findFirst({
                where: {
                    username: args.children_username,
                },
            })
            // check username is exist
            if (childrenInfor) {
                throw new Error(`Children's username is already exist`)
            }
            // get parent infor
            const parentInfor = await prisma.user.findUnique({
                where: {
                    email: args.parent_email,
                },
            })
            if (parentInfor) {
                throw new Error(`Parent's email is already exist`)
            }
            log.info(`checkChildrenUserNameExist: ${JSON.stringify(childrenInfor)}`)
            return 'OK'
        } catch (error) {
            log.error(error)
            global.Sentry.captureException(error)
            throw new Error(error)
        }
    },
}

module.exports = userMutations
