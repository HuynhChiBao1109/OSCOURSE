const _ = require('lodash')

class StringUtil {
    constructor() {
        this._ = _
    }

    // Split string by camel case eg. thisIsAString => ['this','Is','A','String']
    async splitStringByCamelCase(string) {
        try {
            return string.match(/([A-Z]?[^A-Z]*)/g).filter(Boolean)
        } catch (error) {
            return error
        }
    }
}

module.exports = () => {
    return new StringUtil()
}
