const express = require('express')
const {create,getAll} = require('../controllers/employer.controller')
const verifyToken = require('../middleware/verifyToken.middleware')
const router = express.Router()
router.post('/create',create)
router.get('/getAll',getAll)

module.exports = router