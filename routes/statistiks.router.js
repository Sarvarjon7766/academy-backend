const express = require('express')
const {getStatistiks,PaymentStatistiksMonth,TeacherStatistiks,InMonth} = require('../controllers/statistiks.controller')
const router = express.Router()

router.get('/getStatistiks',getStatistiks)
router.get('/students-payment',PaymentStatistiksMonth)
router.get('/teacher-payment',TeacherStatistiks)
router.get('/inMonth',InMonth)

module.exports = router