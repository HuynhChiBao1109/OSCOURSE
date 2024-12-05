/* eslint-disable */
const StringUtil = require('../utils/string.util')

describe('StringUtil', () => {
    const stringUtil = StringUtil()

    it('should split string by camel case', async () => {
        const result = await stringUtil.splitStringByCamelCase('thisIsAString')

        expect(result).toEqual(['this', 'Is', 'A', 'String'])
    })

    it('should return error if string is not provided', async () => {
        const result = await stringUtil.splitStringByCamelCase()

        expect(result).toBeInstanceOf(Error)
    })
})
