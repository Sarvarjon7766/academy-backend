const express = require('express')
const {login,create,getAll,getName,createPersonal,updatePersonal,addMainSubjects,updateMainSubjects,addAdditionalSub,UpdateAdditionalSub,studentSubjects,AddMonthlyPayment,updateOtherCost,getSunday,getOne,MainSubject,MainHistory,AdditionalSubject,StudentDelete,StudentArchived} = require('../controllers/student.controller')
const uploadFile = require('../middleware/upload');
const router = express.Router()

router.post('/login',login)
router.post('/create',create)
router.post('/create-personal',createPersonal)
router.put('/update-personal/:studentId',updatePersonal)
router.put('/add-main/:studentId',addMainSubjects)
router.put('/update-main/:studentId',updateMainSubjects)
router.get('/main-subject/:studentId',MainSubject)
router.get('/main-history/:studentId',MainHistory)
router.put('/add-addition/:studentId',addAdditionalSub)
router.put('/update-addition/:studentId',UpdateAdditionalSub)
router.get('/additional-subject/:studentId',AdditionalSubject)
router.put('/monthly-payment/:studentId',AddMonthlyPayment)
router.put('/other-cost-update/:studentId',updateOtherCost)
router.get('/student-subjects/:studentId',studentSubjects)
router.get('/student-subjects/:studentId',studentSubjects)
router.get('/getSunday',getSunday)
router.get('/getAll',getAll)
router.get('/getOne/:id',getOne)
router.get('/getName',getName)

router.delete('/student-delete/:studentId',StudentDelete)
router.delete('/student-archived/:studentId',StudentArchived)


module.exports = router