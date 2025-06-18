const express = require('express')
const verifyToken = require('../middleware/verifyToken.middleware')
const {create,teacherSubjectGroup,groupForStudents,getGroups,teacherGroups,CountStudent,getStudents,getGrouptoStudents,GetSubject,RelocationGroup,getTeacherGroup} = require('../controllers/group.controller')
const router = express.Router()


router.get('/groups/:subjectId',verifyToken,teacherSubjectGroup)
router.post('/create-group/:subjectId',verifyToken,create)
router.get('/groups-v3/:groupId',groupForStudents)


router.get('/groups/:teacherId/:subjectId',teacherSubjectGroup)
router.get('/groups/:groupId',groupForStudents)
router.get('/search-group',verifyToken,teacherGroups)
router.get('/search-group-student',verifyToken,CountStudent)
router.get('/getStudent/:subjectId',verifyToken,getStudents)
router.get('/getSubject/:groupId',verifyToken,GetSubject)
router.post('/relocation-group/:groupId/:studentId/:selectedGroupId',verifyToken,RelocationGroup)
router.get('/getGroupToStudent/:subjectId',verifyToken,getGrouptoStudents)
router.get('/get-techer-group',getTeacherGroup)



router.get('/getGroups',verifyToken,getGroups)

module.exports = router