const log = require('../services/logger.service')('HookController')
const paymentService = require('../services/payment.service')()

class HookController {
    async get(req, res) {
        try {
            res.status(200).send('Webhook is running')
        } catch (error) {
            log.error(error)
            global.Sentry.captureException(error)
        }
    }

    async post(req, res) {
        try {
            // check token from request header
            if (
                req.headers['secure-token'] !==
                global.config.get('WEBHOOK_SECRET')
            ) {
                log.error('Unauthorized')
                return res.status(401).send('Unauthorized')
            }
            log.info(`Webhook received: ${JSON.stringify(req.body)}`)
            // handle webhook
            res.status(200)
            res.end('OK')
            paymentService.excute(req.body.data)
        } catch (error) {
            log.error(error)
            global.Sentry.captureException(error)
        }
    }
}

module.exports = () => {
    return new HookController()
}
