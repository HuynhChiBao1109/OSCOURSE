const express = require('express')
const fs = require('fs')

const router = express.Router()

// load all routers based on file name eg asset.route.js
const files = fs.readdirSync(__dirname)
files.forEach((file) => {
    if (file !== 'index.js') {
        const routerName = file.split('.')[0]
        const route = require(`./${routerName}.route`)
        router.use(`/${routerName}`, route)
    }
})
// export router
module.exports = router
