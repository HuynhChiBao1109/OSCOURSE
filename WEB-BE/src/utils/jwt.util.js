const jwt = require('jsonwebtoken')

class JWTUtil {
    async generateToken(
        payload,
        expiresIn = global.config.get('JWT_ACCESS_EXPIRATION')
    ) {
        return jwt.sign(payload, global.config.get('JWT_SECRET'), {
            expiresIn: expiresIn,
        })
    }

    async verifyToken(token) {
        return jwt.verify(token, global.config.get('JWT_SECRET'))
    }

    async decodeToken(token) {
        return jwt.decode(token)
    }
}

module.exports = () => {
    return new JWTUtil()
}
