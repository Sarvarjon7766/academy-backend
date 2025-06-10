const express = require('express')
const {create,getAll,update,deleted} = require('../controllers/product.controller')
const router = express.Router()

router.post('/create',create)
router.get('/getAll',getAll)
router.put('/update/:id',update)
router.delete('/delete/:id',deleted)

module.exports = router