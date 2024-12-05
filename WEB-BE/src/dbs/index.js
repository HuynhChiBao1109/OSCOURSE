const { PrismaClient } = require('@prisma/client')

class Prisma {
    constructor() {
        this.prisma = new PrismaClient({
            datasources: {
                db: {
                    url: global.config.get('DATABASE_URL'),
                },
            },
        })
        this.prisma.$connect()
    }

    async get() {
        return this.prisma.quiz.findMany()
    }
}
module.exports = () => {
    return new Prisma()
}
