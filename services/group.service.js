const { default: mongoose } = require('mongoose')
const groupModel = require('../modules/group.model')
const studentModel = require('../modules/student.model')
const teacherModel = require('../modules/teacher.model')
const subjectModel = require('../modules/subject.model')

class GroupService {
	async create(teacherId, subjectId, groupName) {
		try {
			const teacher = new mongoose.Types.ObjectId(teacherId)
			const subject = new mongoose.Types.ObjectId(subjectId)
			const exsistGroup = await groupModel.findOne({ groupName, teacher })
			if (exsistGroup) {
				return { success: false, message: "Bu guruh nomi oldin foydalanilgan" }
			} else {
				const newgroup = groupModel.create({ groupName, teacher, subject })
				if (newgroup) {
					return { success: true, message: "Guruh yaratildi", newgroup }
				} else {
					return { success: false, message: "Guruh yaratilishda xatolik" }
				}
			}
		} catch (error) {
			throw new Error(error.message)
		}
	}

	async studentAddGroup(studentId, oldgroups, groups) {
		try {
			if (!studentId) throw new Error("Student ID berilmagan")
			if (!Array.isArray(groups) || groups.length === 0)
				return { success: false, message: "Guruhlar ro‘yxati bo‘sh" }

			// 1. oldgroups ichidan guruh ID larini chiqaramiz (o‘chirish uchun)
			const oldGroupIds = oldgroups.map(g => g.group.toString())

			// 2. groups ichidan yangi guruh ID larini olamiz (qo‘shish uchun)
			const newGroupIds = groups.map(g => g.group.toString())

			// 3. oldgroupsdagi guruhlardan studentni o‘chiramiz
			const removePromises = oldGroupIds.map(groupId =>
				groupModel.findByIdAndUpdate(groupId, {
					$pull: { students: studentId }
				})
			)

			// 4. groupsdagi guruhlarga studentni qo‘shamiz
			const addPromises = newGroupIds.map(groupId =>
				groupModel.findByIdAndUpdate(groupId, {
					$addToSet: { students: studentId }
				})
			)

			// 5. Parallel bajarish
			await Promise.all([...removePromises, ...addPromises])

			// 6. Qo‘shilgan (yangi) guruhlar holatini qaytaramiz
			const updatedGroups = await groupModel.find({ _id: { $in: newGroupIds } })

			return {
				success: true,
				message: "Student guruhlari yangilandi",
				groups: updatedGroups
			}

		} catch (error) {
			console.error("Xatolik:", error.message)
			return { success: false, message: error.message }
		}
	}


	async groupForStudents(groupId) {
		try {
			const group = await groupModel.findById(groupId)
			if (group && group.students.length !== 0) {
				const studentIds = group.students
				const students = await studentModel.find({ _id: { $in: studentIds } }, { _id: 1, fullName: 1 })
				console.log(students)
				const formattedStudents = students.map(student => ({
					id: student._id,
					studentName: student.fullName
				}))
				return { success: true, students: formattedStudents }
			} else {
				return { success: false, message: "Guruhda talaba mavjud emas" }
			}
		} catch (error) {
			return { success: false, message: error.message }
		}
	}

	async teacherSubjectGroup(teacherId, subjectId) {
		try {
			const newSubjectId = new mongoose.Types.ObjectId(subjectId)
			const newTeacherId = new mongoose.Types.ObjectId(teacherId)
			const groups = await groupModel.find({
				subject: newSubjectId,
				teacher: newTeacherId
			})
			if (groups.length !== 0) {
				return { success: true, groups, teacherid: newTeacherId }
			} else {
				return { success: false, groups, message: "Guruh toplmadi" }
			}
		} catch (error) {
			throw new Error(error.message)
		}
	}
	async teacherGroups(id) {
		try {
			const groups = await groupModel.find({ teacher: id })
			if (groups.length !== 0) {
				return { success: true, groups, message: "Guruhlar" }
			}
			return { success: false, message: "Guruh mavjud emas" }
		} catch (error) {
			throw new Error(error.message)
		}
	}
	async groupStudents(id) {
		try {
			let newgroup = []
			const teacher = await teacherModel.findById(id).select("subjects").lean()
			if (!teacher || !teacher.subjects || !teacher.subjects.length) {
				throw new Error("Subjects topilmadi!")
			}
			const newSubjects = teacher.subjects.map(subject => new mongoose.Types.ObjectId(subject))
			const newTeacherId = new mongoose.Types.ObjectId(id)
			const subjectsData = await subjectModel.find({ _id: { $in: newSubjects } }).select("subjectName").lean()
			const subjectMap = subjectsData.reduce((acc, sub) => {
				acc[sub._id.toString()] = sub.subjectName
				return acc
			}, {})
			const groups = await groupModel.find({
				subject: { $in: newSubjects },
				teacher: newTeacherId
			}).select("subject students").lean()
			const subjectGroups = newSubjects.map(subjectId => {
				const filteredGroups = groups.filter(group => group.subject.toString() === subjectId.toString())
				return {
					subject: subjectMap[subjectId.toString()] || "Noma'lum fan",
					totalStudents: filteredGroups.reduce((sum, group) => sum + group.students.length, 0)
				}
			})
			return { success: true, groups: subjectGroups }
		} catch (error) {
			throw new Error(error.message)
		}
	}
	async CountStudent(teacherId) {
		try {
			const id = new mongoose.Types.ObjectId(teacherId)
			const groups = await groupModel.find({ teacher: id })
			const allStudents = groups
				.map(group => group.students)
				.flat()
				.filter((value, index, self) => self.indexOf(value) === index)
			const uniqueStudents = allStudents.map(id => new mongoose.Types.ObjectId(id))
			const students = await Promise.all(
				uniqueStudents.map(async (studentId) => {
					return await studentModel.findById(studentId).select('gender fullName')

				})
			)
			const genderCount = students.reduce((acc, student) => {
				if (student.gender === 'erkak') {
					acc.male += 1
				} else if (student.gender === 'ayol') {
					acc.female += 1
				}
				return acc
			}, { male: 0, female: 0 })
			const totalStudents = students.length
			const erkak = Math.round((genderCount.male / totalStudents) * 100)
			const ayol = Math.round((genderCount.female / totalStudents) * 100)
			return { success: true, data: { erkak, ayol } }
		} catch (error) {
			throw new Error(error.message)
		}
	}
	async getStudents(teacherId, subjectId) {
		try {
			const groups = await groupModel.find({ teacher: teacherId, subject: subjectId })
			const allStudents = groups
				.map(group => group.students)
				.flat()
				.filter((value, index, self) => self.indexOf(value) === index)
			const students = await Promise.all(
				allStudents.map(async (studentId) => {
					return await studentModel.findById(studentId).select('fullName')
				})
			)
			if (students.length !== 0) {
				return { success: true, students, groups }
			} else {
				return { success: false, message: "Talaba mavjud emas" }
			}
		} catch (error) {
			throw new Error(error.message)
		}
	}
	async getGrouptoStudents(teacherId, subjectId) {
		try {
			const groups = await groupModel.find({ teacher: teacherId, subject: subjectId })
			const enrichedGroups = await Promise.all(groups.map(async (group) => {
				const studentDetails = await Promise.all(
					group.students.map(async (studentId) => {
						const student = await studentModel.findById(studentId).select('fullName')
						return student ? { _id: student._id, fullName: student.fullName } : null
					})
				)
				return {
					...group.toObject(),
					students: studentDetails.filter(Boolean) // null studentlar chiqib ketadi
				}
			}))
			console.log(enrichedGroups)
			if (enrichedGroups.length > 0) {
				return { success: true, groups: enrichedGroups }
			} else {
				return { success: false, message: "Guruhlar topilmadi yoki talabalar yo‘q" }
			}
		} catch (error) {
			throw new Error(error.message)
		}
	}

	async GetSubject(tId, gId) {
		try {
			const teacherId = new mongoose.Types.ObjectId(tId)
			const groupId = new mongoose.Types.ObjectId(gId)
			const group = await groupModel.findById(groupId).select('subject groupName')
			if (!group) {
				return { success: false, message: "Guruh topilmadi" }
			}
			const groupName = group.groupName
			const groups = await groupModel.find({ subject: group.subject, teacher: teacherId })
			if (groups.length > 1) {
				return { success: true, groups, groupName }
			}
			return { success: false, message: "Boshqa guruhga ko'chirib bo'lmaydi" }
		} catch (error) {
			console.error("Xatolik:", error)
			return { success: false, message: error.message }
		}
	}

	async RelocationGroup(tId, gId, sId, seldGId) {
		try {
			const teacher = new mongoose.Types.ObjectId(tId)
			const groupId = new mongoose.Types.ObjectId(gId)
			const studentId = new mongoose.Types.ObjectId(sId)
			const selectGroupId = new mongoose.Types.ObjectId(seldGId)
			console.log({ teacher, groupId, studentId, selectGroupId })
			await groupModel.findByIdAndUpdate(
				groupId,
				{ $pull: { students: studentId } }
			)
			const updatedGroup = await groupModel.findByIdAndUpdate(
				selectGroupId,
				{ $push: { students: studentId } }
			)
			if (updatedGroup.students.includes(studentId)) {
				return { success: true, message: "Talaba ko'chirildi" }
			}
			return { success: false, message: "Talabani ko'chirishdagi xatolik" }
		} catch (error) {
			return { success: false, message: error.message }
		}
	}
	async StudentRemoved(sId) {
		try {
			const studentId = new mongoose.Types.ObjectId(sId)

			// Barcha guruhlarda students massivini tekshirib, bor bo‘lsa o‘chirish
			const result = await groupModel.updateMany(
				{ students: studentId }, // shunday studentId bo‘lgan guruhlar
				{ $pull: { students: studentId } } // students massivdan olib tashlash
			)

			// result.modifiedCount orqali nechta hujjat o‘zgarganini bilish mumkin
			if (result.modifiedCount > 0) {
				return { success: true, message: 'Talaba barcha guruhlardan o‘chirildi.' }
			} else {
				return { success: false, message: 'Talaba hech qaysi guruhda topilmadi.' }
			}
		} catch (error) {
			return { success: false, message: error.message }
		}
	}
}

module.exports = new GroupService()