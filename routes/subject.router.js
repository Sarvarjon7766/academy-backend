const {create,getAll,update,deleted,getOne} = require('../controllers/subject.controller')
const express = require('express')
const router = express.Router()

router.post('/create',create)
router.get('/getAll',getAll)
router.put('/update/:id',update)
router.delete('/delete/:id',deleted)
router.delete('/getOne/:id',getOne)


module.exports = router