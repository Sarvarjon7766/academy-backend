const express = require('express')
const {create,getAll,deleted,update,getTeacher,Personal} = require('../controllers/message.controller')
const verifyToken = require('../middleware/verifyToken.middleware')
const router = express.Router()

router.post('/create',create)
router.get('/getAll',getAll)
router.get('/getTeacher',verifyToken,getTeacher)
router.get('/personal',verifyToken,Personal)
router.delete('/delete/:id',deleted)
router.put('/update/:id',update)

module.exports = router