const express = require('express');
const router = express.Router();

const {create,getAll,teacherAvansInMonth} = require('../controllers/avans.controller')

router.post('/create', create);
router.get('/getAll', getAll);
router.get('/teacher-avans', teacherAvansInMonth);

module.exports = router;
