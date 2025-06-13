const jwt = require('jsonwebtoken')
const teacherModel = require('../modules/teacher.model')
const { default: mongoose } = require('mongoose')
const SubjectModel = require('../modules/subject.model')
const TeacherSubjects = require('./teacherSubjects.service')
const groupModel = require('../modules/group.model')
const attandanceModel = require('../modules/attandance.model')
const studentModel = require('../modules/student.model')


class TeacherService {
	async createPersonal(data) {
		try {
			const exsistTeacher = await teacherModel.findOne({ login: data.login })
			if (exsistTeacher) {
				return { success: false, message: "Bu foydalanuvchi nomida O'qituvchi registratsiya bo'lgan" }
			} else {
				const teacher = await teacherModel.create(data)
				if (teacher) {
					return { success: true, message: "O'qituvchining shaxsiy ma'lumotlari yaratildi", teacher }
				}
				return { success: false, message: "O'qituvchi yaratishda xatolik bo'ldi" }
			}
		} catch (error) {
			return { success: false, message: "Server Error" }
		}
	}
	async updatePersonal(id, data) {
		try {
			const exsistTeacher = await teacherModel.findByIdAndUpdate(id, data, { new: true })
			if (exsistTeacher) {
				return { success: true, teacher: exsistTeacher, message: "O'qituvchining shaxsiy ma'lumotlari yangilandi" }
			} else {
				return { success: false, message: "O'qituvchi yaratishda xatolik bo'ldi" }
			}
		} catch (error) {
			return { success: false, message: "Server Error" }
		}
	}
	async AddSubjects({ teacherId, subjectIds }) {
		try {
			const teacher = await teacherModel.findById(teacherId)
			if (!teacher) {
				return { success: false, message: "O'qituvchi topilmadi" }
			}

			// 1. Eski fanlar va yangi fanlar
			const oldSubjects = teacher.subjects.map(id => id.toString())
			const newSubjects = subjectIds.map(id => id.toString())

			// 2. O'chirilgan fanlar (eski fanlardan yangi fanlarda yo'q bo'lganlar)
			const removedSubjects = oldSubjects.filter(id => !newSubjects.includes(id))

			// 3. O'chirilgan fanlar bo'yicha teacher guruhlarini topamiz
			const removedSubjectObjectIds = removedSubjects.map(id => new mongoose.Types.ObjectId(id))
			const groupsToRemove = await groupModel.find({
				teacher: teacher._id,
				subject: { $in: removedSubjectObjectIds }
			})

			// 4. Har bir o'chirilgan fan bo'yicha ish qilamiz
			for (const removedSubjectId of removedSubjectObjectIds) {
				// a) Shu fan bo'yicha teacherning guruhlari
				const groups = groupsToRemove.filter(g => g.subject.toString() === removedSubjectId.toString())

				for (const group of groups) {
					const studentIds = group.students.map(sid => sid.toString())

					if (studentIds.length === 0) continue

					// b) Shu fan bo'yicha boshqa teacherlarning guruhlari
					const otherTeacherGroups = await groupModel.find({
						subject: removedSubjectId,
						teacher: { $ne: teacher._id }
					})

					for (const otherGroup of otherTeacherGroups) {
						const existingStudents = otherGroup.students.map(sid => sid.toString())

						// c) Talabalarni takrorlanmaslik uchun filter qilamiz
						const newStudents = studentIds.filter(sid => !existingStudents.includes(sid))

						if (newStudents.length > 0) {
							otherGroup.students.push(...newStudents.map(id => new mongoose.Types.ObjectId(id)))
							await otherGroup.save()
						}
					}
				}
			}

			// 5. Teacherning fanlarini yangilaymiz
			teacher.subjects = subjectIds.map(id => new mongoose.Types.ObjectId(id))
			await teacher.save()

			return { success: true, message: "Fanlar muvaffaqiyatli yangilandi va talabalar boshqa guruhlarga ko'chirildi" }

		} catch (error) {
			console.error(error)
			return { success: false, message: "Server xatoligi" }
		}
	}

	async CheckSubject(id) {
		try {

			const teacher = await teacherModel.findById(id).populate({
				path: 'subjects',
				select: 'subjectName'
			})
			if (!teacher) {
				return { success: false, message: "O'qituvchi topilmadi" }
			} else {
				const subjects = teacher.subjects
				return { success: true, subjects }
			}
		} catch (error) {
			console.error(error)
			return { success: false, message: "Server xatoligi" }
		}
	}
	async CheckSalary(id) {
		try {
			const teacher = await teacherModel.findById(id)
			const salary = { salary: teacher.salary, share_of_salary: teacher.share_of_salary }
			return { success: true, message: "Oylik maoshlar", salary }
		} catch (error) {
			console.error(error)
			return { success: false, message: "Server xatoligi" }
		}
	}
	async AddSalary(data) {
		try {
			const teacher = await teacherModel.findById(new mongoose.Types.ObjectId(data.teacherId))
			if (!teacher) {
				return { success: false, message: "O'qituvchi topilmadi" }
			}

			const updatedTeacher = await teacherModel.findByIdAndUpdate(
				new mongoose.Types.ObjectId(data.teacherId),
				{
					salary: data.salary,
					share_of_salary: data.share_of_salary
				},
				{ new: true }
			)

			if (updatedTeacher) {
				console.log(updatedTeacher)
				return { success: true, message: "O'qituvchining oyligi qo'shildi" }
			}

			return { success: false, message: "O'qituvchining oyligini qo'shishda xatolik" }
		} catch (error) {
			console.error(error)
			return { success: false, message: "Server xatoligi" }
		}
	}
	async getTeacher(id) {
		try {
			const objectId = new mongoose.Types.ObjectId(id)
			const teacher = await teacherModel.findById(objectId).populate({
				path: 'subjects',
				select: 'subjectName'
			})

			if (!teacher) {
				return { success: false, message: "O'qituvchi topilmadi" }
			}
			return { success: true, teacher }

		} catch (error) {
			console.error(error)
			return { success: false, message: "Server xatoligi" }
		}
	}
	async login(login, password) {
		try {
			const exsistTeacher = await teacherModel.findOne({ login })

			if (!exsistTeacher) {
				return { success: false, message: 'Foydalanuvchi topilmadi' }
			}
			if (password == exsistTeacher.password) {

				const token = jwt.sign({ id: exsistTeacher._id, role: exsistTeacher.role, isAdmin: exsistTeacher.isAdmin }, process.env.SECRET_KEY, { expiresIn: '1h' })

				return { success: true, token, isAdmin: exsistTeacher.isAdmin }
			}
			return { success: false, message: 'parol xato' }
		} catch (error) {
			throw new Error(error)
		}
	}
	async update(id, data) {
		try {
			if (id && data) {
				if (Array.isArray(data.subjects)) {
					let newsubject = data.subjects
						.filter(subject => mongoose.Types.ObjectId.isValid(subject)) // Faqat yaroqli IDlarni olish
						.map(subject => new mongoose.Types.ObjectId(subject))

					console.log(newsubject)

					await teacherModel.findByIdAndUpdate(id, { ...data, photo: "fdsfdsf", subjects: newsubject }, { new: true })
					return { success: true, message: "Ma'lumot yangilandi" }

				} else {
					console.log("subjects mavjud emas yoki massiv emas.")
				}
			}
		} catch (error) {
			console.error("Xatolik yuz berdi:", error)
		}
	}

	async getAll() {
		try {
			const teachers = await teacherModel.find().populate('subjects', 'subjectName')
			if (!teachers || teachers.length === 0) {
				return { success: false, message: "teacherlar topilmadi" }
			}

			// Har bir teacher uchun getSubjects chaqiramiz
			const teachersWithSubjects = await Promise.all(
				teachers.map(async (teacher) => {
					const subjectsData = await this.getSubjects(teacher._id)
					return {
						...teacher.toObject(),
						subjectNames: subjectsData.subjectNames // Fan nomlarini string holatda qo'shish
					}
				})
			)

			return {
				success: true,
				message: "Teacherning ma'lumotlari olindi",
				teachers: teachersWithSubjects
			}
		} catch (error) {
			throw new Error(error.message)
		}
	}
	async getOne(user) {
		try {
			const id = new mongoose.Types.ObjectId(user.id)
			const data = await teacherModel.findOne({ _id: id })
			if (data) {
				return { success: true, user: data }
			}
			return { success: false, user: null }
		} catch (error) {
			throw new Error(error.message)
		}
	}
	async ChangePassword(id, password) {
		try {
			console.log(id)
			console.log(password)
			const data = await teacherModel.findByIdAndUpdate(id, { password: password }, { new: true })
			if (data) {
				return { success: true, message: "Parol muvafaqiyatli o'zgartirildi" }
			}
			return { success: false, message: "Parolni o'zgartirishda xatolik" }
		} catch (error) {
			throw new Error(error.message)
		}
	}
	async getSubjects(teacherId) {
		try {

			let teacher = await teacherModel.findById(teacherId)

			if (!teacher) {
				return console.log("O'qituvchi topilmadi!")
			}
			let subjectIds = teacher.subjects // subjects maydoni ID larni o'z ichiga olgan bo'lishi 
			let convertedIds = subjectIds.map(id => new mongoose.Types.ObjectId(id))
			let subjects = await SubjectModel.find({ _id: { $in: convertedIds } }, "subjectName")
			const SubjectStudent = await TeacherSubjects.teacherSubjects(teacherId)

			let subjectNames = subjects.map(sub => sub.subjectName).join(", ")


			return { success: true, subjects, subjectNames, teacherId, SubjectStudent }
		} catch (error) {
			throw new Error(error.message)
		}
	}
	async deleted(id) {
		try {
			if (id) {
				await teacherModel.findByIdAndDelete(id)
				return { success: true, message: "Teacher o'chirildi" }
			}
			return { success: false, message: "Id kelmadi" }
		} catch (error) {
			throw new Error(error.message)
		}
	}
	async subTeacher(subjectId) {
		try {
			const newSubjectId = new mongoose.Types.ObjectId(subjectId)
			const teachers = await teacherModel.find({ subjects: newSubjectId })
			if (teachers) {
				return { success: true, teachers }
			}
			return { success: false, message: "Bu fanni o'qituvchilari topilmadi" }
		} catch (error) {
			throw new Error(error.message)
		}
	}
	async TeacherSelery({ year, month }) {
		try {
			const newYear = Number(year)
			const newMonth = Number(month)

			// Yaroqli yil va oy tekshiruvini kiritamiz
			if (
				isNaN(newYear) || isNaN(newMonth) ||
				newYear < 2000 || newYear > 2100 ||
				newMonth < 1 || newMonth > 12
			) {
				return { success: false, message: "Yil yoki oy noto‘g‘ri kiritilgan." }
			}

			const startOfMonth = new Date(newYear, newMonth - 1, 1)
			const endOfMonth = new Date(newYear, newMonth, 0, 23, 59, 59)

			const teachers = await teacherModel.find({ isAdmin: false })
			const result = []

			for (const teacher of teachers) {
				const subjectEntries = []

				for (const subjectId of teacher.subjects) {
					const groups = await groupModel.find({
						teacher: teacher._id,
						subject: subjectId
					})
						.populate({ path: 'students', select: 'fullName main_subjects additionalSubjects' })
						.populate({ path: 'subject', select: 'subjectName' })

					const groupData = await Promise.all(
						groups.map(async (group) => {
							const studentsWithAttendance = await Promise.all(
								group.students.map(async (s) => {
									const attendanceRecords = await attandanceModel.find({
										studentId: s._id,
										groupId: group._id,
										date: { $gte: startOfMonth, $lte: endOfMonth },
									}).select('date Status score sunday -_id')

									const mainSubject = s.main_subjects.find(
										(subj) => subj.groupId.toString() === group._id.toString()
									)

									const additionalSubject = s.additionalSubjects.find(
										(subj) => subj.groupId.toString() === group._id.toString()
									)

									const price = mainSubject?.price ?? additionalSubject?.price ?? 0

									return {
										studentId: s._id.toString(),
										fullName: s.fullName,
										attendance: attendanceRecords,
										price,
									}
								})
							)

							// totalDays hisoblash — eng ko'p qatnashilgan darslar soni
							let totalDays = 0

							for (const student of studentsWithAttendance) {
								const count = student.attendance.filter(
									(a) => a.Status === "Kelgan" || a.Status === "Kelmagan"
								).length

								if (count > totalDays) totalDays = count
							}
							return {
								groupId: group._id.toString(),
								groupName: group.groupName,
								students: studentsWithAttendance,
								totalDays,
							}
						})
					)

					if (groupData.length) {
						subjectEntries.push({
							subjectId: subjectId.toString(),
							subjectName: groups[0].subject?.subjectName || 'Noma’lum fan',
							groups: groupData
						})
					}
				}

				result.push({
					teacherId: teacher._id.toString(),
					teacherName: teacher.fullName,
					share_of_salary: teacher.share_of_salary / 100,
					subjects: subjectEntries
				})
			}

			return { success: true, data: result }
		} catch (err) {
			console.error(err)
			return { success: false, message: 'Ichki xatolik yuz berdi' }
		}
	}


	async TeacherStudent({ year, month }) {
		try {
			const startDate = new Date(year, month - 1, 1)
			const endDate = new Date(year, month, 1)

			const teachers = await teacherModel.find()
			const groups = await groupModel.find().populate("students")
			const allAttendance = await attandanceModel.find({
				date: { $gte: startDate, $lt: endDate }
			})

			const result = []

			for (const teacher of teachers) {
				const teacherSubjectIds = teacher.subjects.map(id => id.toString())

				const teacherGroups = groups.filter(group =>
					group.teacher.toString() === teacher._id.toString() &&
					group.subject &&
					teacherSubjectIds.includes(group.subject.toString())
				)

				const teacherStats = []

				for (const group of teacherGroups) {
					const groupId = group._id.toString()
					const subjectId = group.subject.toString()

					const totalLessons = await attandanceModel.distinct('date', {
						groupId,
						date: { $gte: startDate, $lt: endDate }
					}).then(dates => dates.length)

					for (const studentId of group.students) {
						const student = await studentModel.findById(studentId)

						if (!student) continue
						console.log(student)

						const subjectData = student.main_subjects.find(
							s => s.subjectId.toString() === subjectId.toString()
						)

						if (!subjectData || !subjectData.price) continue

						const price = subjectData.price

						const attendedLessons = allAttendance.filter(a =>
							a.groupId?.toString() === groupId &&
							a.studentId?.toString() === studentId.toString() &&
							a.Status === "Kelgan"
						).length

						const oneLessonPrice = price / totalLessons || 0
						const studentPayment = Math.round(attendedLessons * oneLessonPrice)

						teacherStats.push({
							studentId: studentId.toString(),
							groupId,
							subjectId,
							totalLessons,
							attendedLessons,
							fullSubjectPrice: price,
							calculatedPayment: studentPayment
						})
					}
				}

				result.push({
					teacherId: teacher._id,
					totalStudents: teacherStats.length,
					teacherStats
				})
			}
			console.log(result[1].teacherStats)

			// ✅ RETURN outside the for-loop
			return {
				success: true,
				data: result
			}
		} catch (error) {
			console.error("Xatolik:", error)
			return {
				success: false,
				message: "Ichki xatolik yuz berdi"
			}
		}
	}


}


module.exports = new TeacherService()