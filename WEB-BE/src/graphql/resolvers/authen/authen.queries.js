const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const log = require('../../../services/logger.service')('AuthenQueries')
const bcrypt = require('bcrypt')
const jwt = require('../../../utils/jwt.util')()

const authenQueries = {
    getAccessToken: async (parent, args, context, info) => {
        // handle get token here
        // const refreshToken = context.headers[Authorization];
        //
        // return token;
    },
}

module.exports = authenQueries
