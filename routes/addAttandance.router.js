const express = require('express')
const {create,ChekingAttandance,getAttandanceForYear,lowAchievingStudents,createSunday,Calculate} = require('../controllers/attandance.controller')
const verifyToken = require('../middleware/verifyToken.middleware')
const router = express.Router()

router.post('/create',verifyToken,create)
router.post('/create-sunday',verifyToken,createSunday)
router.get('/checking/:groupId',verifyToken,ChekingAttandance)
router.get('/search-attandance/:date',verifyToken,getAttandanceForYear)
router.get('/search-lowachieving/:date/:month',verifyToken,lowAchievingStudents)
router.get('/calculate',Calculate)

module.exports = router