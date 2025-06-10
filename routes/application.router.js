const express = require('express')
const {create,getAll,update} = require('../controllers/application.controller')
const router = express.Router()

router.post('/create',create)
router.get('/getAll',getAll)
router.put("/update/:id",update);

module.exports = router