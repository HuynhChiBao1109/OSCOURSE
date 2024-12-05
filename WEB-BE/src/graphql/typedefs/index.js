// read all .gql files in the current directory and export them as an string
const fs = require('fs')
const path = require('path')
const dir = __dirname
const files = fs.readdirSync(dir)
const typeDefs = files.reduce((acc, file) => {
    if (path.extname(file) === '.gql') {
        const content = fs.readFileSync(path.join(dir, file), 'utf8')
        return acc + content
    }
    return acc
}, '')
module.exports = typeDefs
