const App = require('./app')
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const log = require('../services/logger.service')('GraphqlApp')
const { createContext } = require('../graphql/context')
const typeDefs = require('../graphql/typedefs')
const resolvers = require('../graphql/resolvers')
class GraphqlApp extends App {
    /**
     * Represents the constructor of the GraphQL app.
     * @constructor
     */
    constructor() {
        super()
    }

    /**
     * Starts the GraphqlApp.
     * @returns {Promise<void>} A promise that resolves when the app is started.
     */
    async start() {
        super.start('GraphqlApp')
        try {
            const server = new ApolloServer({
                typeDefs: typeDefs,
                resolvers: resolvers,
                context: createContext,
                csrfPrevention: false,
                allowBatchedHttpRequests: true,
                includeStacktraceInErrorResponses:
                    global.config.get('NODE_ENV') === 'development',
                formatError: (err) => {
                    log.error(err.extensions.stacktrace)
                    global.Sentry.captureException(err)
                    return err
                },
            })

            const { url } = await startStandaloneServer(server, {
                context: createContext,
                listen: { port: `${global.config.get('GRAPHQL_PORT')}` },
            })
            log.info(`🚀 Server ready at ${url}`)
        } catch (error) {
            log.error(error)
            global.Sentry.captureException(error)
        }
    }

    /**
     * Stops the application.
     */
    stop() {
        super.stop()
    }

    /**
     * Restarts the application.
     */
    restart() {
        super.restart()
    }
}

module.exports = GraphqlApp
