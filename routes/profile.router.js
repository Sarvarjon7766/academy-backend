const express = require('express')
const {getOne} = require('../middleware/profile.middleware')
const verifyToken = require('../middleware/verifyToken.middleware')
const router = express.Router()
router.get('/getOne',verifyToken,getOne)


module.exports = router