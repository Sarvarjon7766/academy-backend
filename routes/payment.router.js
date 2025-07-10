const express = require('express')
const {checkPayment,Pay,getPayments,paymentHistory} = require('../controllers/payment.controller')
const router = express.Router()



router.get('/check',checkPayment)
router.get('/getPaymants',getPayments)
router.get('/history',paymentHistory)
router.post('/pay',Pay)



module.exports = router