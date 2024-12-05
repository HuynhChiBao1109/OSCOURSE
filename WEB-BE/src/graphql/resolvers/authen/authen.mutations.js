const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const log = require('../../../services/logger.service')('GraphqlResolvers')
const bcrypt = require('bcrypt')
const jwt = require('../../../utils/jwt.util')()
const avatarURL = require('../../../utils/imageAvatar.util')
const { sendMail } = require('../../../helpers/mail.helper')

/**
 * Object containing resolver functions for authentication mutations.
 * @typedef {Object} AuthenMutations
 * @property {Function} loginByUser - Resolver function for user login.
 * @property {Function} loginByChildren - Resolver function for children login.
 * @property {Function} registerParent - Resolver function for parent registration.
 * @property {Function} registerChildren - Resolver function for children registration.
 * @property {Function} forgotPassword - Resolver function for password reset.
 */

/**
 * Resolver functions for authentication mutations.
 * @type {AuthenMutations}
 */

const authenMutations = {
    loginByUser: async (parent, args, context, info) => {
        // check email is exist
        const user = await prisma.user.findUnique({
            where: {
                email: args.user.email,
            },
        })
        if (!user) {
            throw new Error('Email is not exist')
        }

        if (user.status === 'inActive') {
            throw new Error('Your account is inactive')
        }

        // check pass is correct
        const validPass = await bcrypt.compare(
            args.user.password,
            user.password
        )
        // check validPass when promise is resolved
        if (!validPass) {
            throw new Error('Invalid password')
        }
        // handle create token here
        const token = await jwt.generateToken(
            user,
            global.config.get('JWT_REFRESH_EXPIRATION')
        )
        log.info(`token: ${token}`)
        // censor user password before return
        user.password = 'censored'
        user.token = token
        user.User = user
        return user
    },

    loginByChildren: async (parent, args, context, info) => {
        // check username is exist
        const isUserNameExist = await prisma.children.findUnique({
            where: {
                username: args.children.username,
            },
        })
        if (!isUserNameExist) {
            throw new Error('You have not registered yet')
        }
        if (isUserNameExist.status === 'inActive') {
            throw new Error('Op your account is inactive')
        }
        // check pass is correct
        const validPass = await bcrypt.compare(
            args.children.password,
            isUserNameExist.password
        )
        if (!validPass) {
            throw new Error('Invalid password')
        }
        // handle create token here
        const token = jwt.generateToken(
            isUserNameExist,
            global.config.get('JWT_REFRESH_EXPIRATION')
        )
        // censor user password before return
        isUserNameExist.password = 'censored'
        isUserNameExist.Children = isUserNameExist
        isUserNameExist.token = token
        // handle message
        isUserNameExist.message = {
            message: 'Login success',
            code: 200,
        }
        return isUserNameExist
    },

    registerParent: async (parent, args, context, info) => {
        // check email is exist
        const isUserExist = await prisma.user.findUnique({
            where: {
                email: args.user.email,
            },
        })
        if (isUserExist) {
            throw new Error('Email is already exist')
        }
        // hash password
        const hashPass = await bcrypt.hash(args.user.password, 8)
        // set avatar
        if (args.user.gender === 'women') {
            args.user.avatar = avatarURL.motherAvatar
        } else {
            args.user.avatar = avatarURL.fathertAvatar
        }
        // create user
        const result = await prisma.user.create({
            data: {
                email: args.user.email,
                password: hashPass,
                name: args.user.name,
                role: 'parent',
                status: 'active',
                date_of_birth: args.user.date_of_birth,
                phone: args.user.phone,
                avatar: args.user.avatar,
                gender: args.user.gender,
            },
        })
        result.password = 'censored'
        // handle send email here
        await sendMail(
            args.user.email,
            'Register success',
            'You have successfully registered an account on OSCOURSE'
        )
        return result
    },

    registerChildren: async (parent, args, context, info) => {
        // check username is exist
        const isUserNameExist = await prisma.children.findFirst({
            where: {
                username: args.children.username,
            },
        })
        if (isUserNameExist) {
            throw new Error('Username is already exist')
        }
        // get parent infor
        const parentInfor = await prisma.user.findUnique({
            where: {
                id: args.children.parent_id,
            },
        })
        // check date of birth compare to parent
        if (parentInfor.date_of_birth < args.children.date_of_birth) {
            throw new Error('Date of birth is invalid')
        }
        // hash password
        const hashPass = await bcrypt.hash(args.children.password, 8)
        // set avatar
        if (args.children.gender === 'women') {
            args.children.avatar = avatarURL.daughterAvatar
        } else {
            args.children.avatar = avatarURL.sonAvatar
        }
        // create user
        const result = await prisma.children.create({
            data: {
                username: args.children.username,
                password: hashPass,
                name: args.children.name,
                role: 'children',
                status: 'active',
                date_of_birth: args.children.date_of_birth,
                avatar: args.children.avatar,
                gender: args.children.gender,
                parent_id: args.children.parent_id,
            },
        })
        // send mail to prarent
        await sendMail(
            parentInfor.email,
            'Register success',
            `You have successfully registered an account for ${args.children.name} on OSCOURSE`
        )
        return result
    },

    forgotPassword: async (parent, args, context, info) => {
        // check email is exist
        const isUserExist = await prisma.user.findUnique({
            where: {
                email: args.email,
            },
        })
        if (!isUserExist) {
            throw new Error('Email is not exist')
        }
        // generate auto password include 8 characters
        const autoPass = Math.random().toString(36).slice(-8)
        // hash password
        const hashPass = await bcrypt.hash(autoPass, 8)
        // update new password
        await prisma.user.update({
            where: {
                email: args.email,
            },
            data: {
                password: hashPass,
            },
        })
        // send mail to user
        await sendMail(
            args.email,
            'Password reset success',
            `Your new password is: ${autoPass}`
        )

        // handle send email here
        return {
            message: 'Check your mail to get new password',
            code: 200,
        }
    },
}

module.exports = authenMutations
