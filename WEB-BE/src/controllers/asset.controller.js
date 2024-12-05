const log = require('../services/logger.service')('AssetController')
const supabase = require('../dbs/supabase.db')().init()

class AssetController {
    async upsert(req, res, next) {
        try {
            const { name, type, size, bucket, url } = req.body
            const asset = await global.supabase.storage
                .from(bucket)
                .upsert(name, { name, type, size, url })
            res.status(200).json(asset)
        } catch (error) {
            next(error)
        }
    }

    async get(req, res, next) {
        try {
            const { data, error } = await supabase.storage.get(
                '253acf44-39ce-4933-b0fa-e3a71007b732'
            )
            if (error) {
                throw new Error(error.message)
            }
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = () => {
    return new AssetController()
}
