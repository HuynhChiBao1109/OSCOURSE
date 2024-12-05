const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const createContext = async ({ req }) => {
    const headers = req.headers;

    return {
        prisma: prisma,
        headers: headers
    };
};

module.exports = {
    createContext,
}
