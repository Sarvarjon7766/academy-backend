const express = require('express')
const router = express.Router()
const { attandanceAdd,AllAttandance } = require('../controllers/teacherattandance.controller')

router.post('/attandanceAdd', attandanceAdd)
router.get('/getAll', AllAttandance)


module.exports = router