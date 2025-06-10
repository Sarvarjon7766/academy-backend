const express = require('express')
const {create,getAll,AddHotelToStudent,CheckStudent} = require('../controllers/rooms.controller')
const router = express.Router()

router.post('/create',create)
router.get('/getAll',getAll)
router.get('/check-student/:studentId',CheckStudent)
router.put('/add-hotel/:studentId',AddHotelToStudent)


module.exports = router