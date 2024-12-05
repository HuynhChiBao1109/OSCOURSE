const supabase = require('../dbs/supabase.db')().init()
const log = require('../services/logger.service')('ImageHelper')
class ImageHelper {
    async createSignUrl(path) {
        const signUrl = supabase.then((supabase) => {
            supabase.storage
                .from('assets')
                .createSignedUploadUrl(path)
                .then(({ data, error }) => {
                    if (error) {
                        global.Sentry.captureException(error)
                        log.error(error)
                    }
                    return data.signUrl
                })
        })
        return signUrl
    }
}

module.exports = new ImageHelper()
