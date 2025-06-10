const express = require('express')

const uploadFile = require('../middleware/upload');
const router = express.Router()


router.post('/create',uploadFile,(req,res)=>{
	console.log(req.body)
})

module.exports = router