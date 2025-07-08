const express = require('express')
const router = express.Router()
const { attandanceAdd,AllAttandance,GetInMonth } = require('../controllers/teacherattandance.controller')

router.post('/attandanceAdd', attandanceAdd)
router.get('/getAll', AllAttandance)
router.get('/getInmonth', GetInMonth)


module.exports = router