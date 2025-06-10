const jwt = require('jsonwebtoken')
const teacherModel = require('../modules/teacher.model')
const { default: mongoose } = require('mongoose')
const SubjectModel = require('../modules/subject.model')
const TeacherSubjects = require('./teacherSubjects.service')
const groupModel = require('../modules/group.model')


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
	async AddSubjects({teacherId, subjectIds}) {
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
}


module.exports = new TeacherService()