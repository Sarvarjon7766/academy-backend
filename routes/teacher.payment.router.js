const express = require('express')
const router = express.Router()
const {create,paymentcheck} = require('../controllers/teacher.payment.controller')

router.post('/create',create)
router.get('/paymentcheck',paymentcheck)


module.exports = router