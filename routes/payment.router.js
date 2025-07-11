const express = require('express')
const {checkPayment,Pay,getPayments,paymentHistory,resgistratationPaymentHistory} = require('../controllers/payment.controller')
const router = express.Router()



router.get('/check',checkPayment)
router.get('/getPaymants',getPayments)
router.get('/history',paymentHistory)
router.post('/register-history',resgistratationPaymentHistory)
router.post('/pay',Pay)



module.exports = router