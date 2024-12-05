const hookController = require('../controllers/hook.controller')()
const express = require('express')
const log = require('../services/logger.service')('WebhookRoute')
const router = express.Router()

try {
    router.get('/', hookController.get)
    router.post('/', hookController.post)
} catch (error) {
    log.error(error)
    global.Sentry.captureException(error)
}

module.exports = router
