const jwt = require('jsonwebtoken')
const { AuthenticationError, ForbiddenError } = require('apollo-server-errors')

// requireAuth is now a middleware that can be applied directly in the resolver
const requireAuth = async (role, context) => {
    const token = context.headers.authorization
    if (!token) {
        throw new AuthenticationError('Login required')
    }

    try {
        const decoded = jwt.verify(
            token.replace('Bearer ', ''),
            global.config.get('JWT_SECRET')
        )
        if (role && decoded.role !== role) {
            throw new ForbiddenError('Forbidden: Incorrect role')
        }
        // Successfully authenticated and authorized
        return decoded // Return the decoded token for further use
    } catch (err) {
        if (
            err.name === 'JsonWebTokenError' ||
            err.name === 'TokenExpiredError'
        ) {
            throw new AuthenticationError('Invalid or expired token')
        }
        throw err // Rethrow any other unexpected error
    }
}

const requireNoAuth = async (context) => {
    const token = context.headers.authorization
    if (token) {
        throw new ForbiddenError('Forbidden: Already authenticated')
    }
}

const requireAuthen = async (context) => {
    const token = context.headers.authorization
    if (!token) {
        throw new AuthenticationError('Login required')
    }
}

module.exports = {
    requireAuth,
    requireNoAuth,
    requireAuthen
}
