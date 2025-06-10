const express = require('express')
const {create,getAll,checkPayment,Pay,Calculate,Balance,MonthlyCheck} = require('../controllers/payment.controller')
const router = express.Router()

router.post('/create',create)
router.get('/getAll',getAll)
router.get('/check',checkPayment)
router.get('/monthly-check',MonthlyCheck)
router.post('/pay',Pay)
router.post('/calculate',Calculate)
router.post('/balance',Balance)


module.exports = router