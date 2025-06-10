const mongoose = require('mongoose')
const groupModel = require('../modules/group.model') // Guruhlar modeli
const studentModel = require('../modules/student.model') // Talabalar modeli
const subjectModel = require('../modules/subject.model') // Fanlar modeli

class TeacherSubjects {
	async teacherSubjects(teacherId) {
		try {
			const groups = await groupModel.find({ teacher: teacherId })
			console.log(groups)

			// 2. subjectId bo'yicha studentId larni yig'ish
			const subjectStudentMap = {}
			for (const group of groups) {
				const subjectId = group.subject.toString()

				if (!subjectStudentMap[subjectId]) {
					subjectStudentMap[subjectId] = new Set()
				}

				group.students.forEach(studentId => {
					subjectStudentMap[subjectId].add(studentId.toString())
				})
			}

			// 3. Natijaviy object: { subjectName: [fullName, ...] }
			const result = {}

			for (const [subjectId, studentSet] of Object.entries(subjectStudentMap)) {
				const studentIds = Array.from(studentSet).map(id => new mongoose.Types.ObjectId(id))

				const students = await studentModel.find({ _id: { $in: studentIds } }).select('fullName')
				const subject = await subjectModel.findById(subjectId).select('subjectName')

				result[subject.subjectName] = students.map(student => student.fullName)
			}
			console.log(result)

			return result
		} catch (error) {
			throw new Error(error)
		}
	}
}

module.exports = new TeacherSubjects()