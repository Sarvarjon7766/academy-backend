const express = require('express');
const router = express.Router();
const uploadFile = require('../middleware/upload');
const DeletePhoto = require('../middleware/deletePhotoMiddleware')
const {create,getAll,update,deleted} = require('../controllers/ads.controller'); 

// Reklama yaratish (faylni yuklash va saqlash)
router.post('/create', uploadFile, create);
router.get('/getAll', getAll);
router.put('/update/:id',uploadFile, update);
router.delete('/delete/:id',DeletePhoto, deleted);

module.exports = router;
