const express = require('express')
const {paymentCreate} = require('../controllers/studentpayment.controller')
const router = express.Router()

router.post('/create',paymentCreate)


module.exports = router