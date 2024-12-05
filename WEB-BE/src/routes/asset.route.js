const assetController = require('../controllers/asset.controller')()
const express = require('express')
const log = require('../services/logger.service')('AssetRoute')
const router = express.Router()

try {
    router.get('/', assetController.get)
    router.post('/', assetController.upsert)
} catch (error) {
    log.error(error)
    global.Sentry.captureException(error)
}

module.exports = router
