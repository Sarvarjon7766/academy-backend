const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/verifyToken.middleware')
const {checktoken} = require('../controllers/checktoken.controller')

router.get('/checktoken',verifyToken,checktoken)

module.exports = router