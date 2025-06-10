const express = require('express') 
const { create, update, deleted, Login, getAll, isActive, getOne,getOneRegister } = require('../controllers/register.controller')
const verifToken = require('../middleware/verifyToken.middleware')
const router = express.Router()

router.post('/create',create)
router.put('/update/:id',update)
router.delete('/delete/:id',deleted)
router.post('/login',Login)
router.get('/getAll',getAll)
router.put('/isActive/:id',isActive)
router.get('/getOne/:id',getOne)
router.get('/getOne/',verifToken,getOne)



module.exports = router