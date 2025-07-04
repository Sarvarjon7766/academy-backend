const jwt = require('jsonwebtoken')
const teacherModel = require('../modules/teacher.model')
const { default: mongoose } = require('mongoose')
const SubjectModel = require('../modules/subject.model')
const TeacherSubjects = require('./teacherSubjects.service')
const groupModel = require('../modules/group.model')
const attandanceModel = require('../modules/attandance.model')
const studentModel = require('../modules/student.model')
const teacherattendanceModel = require('../modules/teacherattandance.model')



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

			if (!teacher || !teacher.salaryHistory || teacher.salaryHistory.length === 0) {
				return { success: true, message: "Hozircha oylik mavjud emas", salary: { salary: 0, share_of_salary: 0 } }
			}

			const sorted = teacher.salaryHistory.sort((a, b) => new Date(b.from) - new Date(a.from))
			const latest = sorted[0]

			return {
				success: true,
				message: "Eng so‘nggi oylik ma'lumoti",
				salary: { salary: latest.salary, share_of_salary: latest.share_of_salary }
			}
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

			const newEntry = {
				from: new Date(),
				salary: data.salary,
				share_of_salary: data.share_of_salary
			}

			teacher.salaryHistory = teacher.salaryHistory || []
			teacher.salaryHistory.push(newEntry)

			await teacher.save()

			return { success: true, message: "O'qituvchining oyligi tarixga qo‘shildi" }

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
			const teachers = await teacherModel.find({ isAdmin: false }).populate('subjects', 'subjectName')
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

			// 💡 Versiyani aniqlash uchun yordamchi funksiya
			const getSalaryVersion = (salaryHistory, date) => {
				if (!Array.isArray(salaryHistory)) return null
				return salaryHistory
					.filter(v => new Date(v.from) <= date)
					.sort((a, b) => new Date(b.from) - new Date(a.from))[0] || null
			}

			for (const teacher of teachers) {
				// 🎯 Versiyani aniqlaymiz
				const version = getSalaryVersion(teacher.salaryHistory, endOfMonth)

				const currentSalary = version?.salary || teacher.salary || 0
				const currentShare = version?.share_of_salary || teacher.share_of_salary || 0

				let totalHisoblanma = 0
				const subjectEntries = []

				for (const subjectId of teacher.subjects) {
					const groups = await groupModel.find({
						teacher: teacher._id,
						subject: subjectId
					})
						.populate({ path: 'students', select: 'fullName main_subjects additionalSubjects main_subject_history additional_subject_history createdAt' })
						.populate({ path: 'subject', select: 'subjectName' })

					const groupData = []

					for (const group of groups) {
						const teacherAbsences = await teacherattendanceModel.find({
							teacher: teacher._id,
							subject: subjectId,
							group: group._id,
							date: { $gte: startOfMonth, $lte: endOfMonth }
						}).select('date -_id')

						const teacherAbsentDates = teacherAbsences
							.filter(item => item.date instanceof Date && !isNaN(item.date))
							.map(item => item.date.toISOString().split('T')[0])

						const studentsInGroup = new Map()
						group.students.forEach(student => {
							studentsInGroup.set(student._id.toString(), student)
						})

						const allStudents = await studentModel.find({}).select('fullName main_subjects additionalSubjects main_subject_history additional_subject_history createdAt')

						for (const student of allStudents) {
							const histories = [...(student.main_subject_history || []), ...(student.additional_subject_history || [])]
							for (const h of histories) {
								const isSameGroup = h.groupId?.toString() === group._id.toString()
								const isSameTeacher = h.teacherId?.toString() === teacher._id.toString()
								const isSameSubject = h.subjectId?.toString() === subjectId.toString()
								if (!isSameGroup || !isSameTeacher || !isSameSubject) continue

								const from = new Date(h.fromDate)
								const to = h.toDate ? new Date(h.toDate) : endOfMonth

								if (from <= endOfMonth && to >= startOfMonth) {
									studentsInGroup.set(student._id.toString(), student)
								}
							}
						}

						const allLessonDates = []
						for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
							if (d.getDay() !== 0) allLessonDates.push(new Date(d))
						}

						const studentsWithAttendance = []

						for (const studentId of studentsInGroup.keys()) {
							const student = studentsInGroup.get(studentId)

							if (student.createdAt && new Date(student.createdAt) > endOfMonth) continue

							const attendanceRaw = await attandanceModel.find({
								studentId: student._id,
								groupId: group._id,
								date: { $gte: startOfMonth, $lte: endOfMonth },
							}).select('date Status score sunday -_id')

							const attendanceMap = new Map(attendanceRaw.map(a => [a.date.toISOString().split('T')[0], a]))

							const history = [...(student.main_subject_history || []), ...(student.additional_subject_history || [])]
								.find(h => h.groupId.toString() === group._id.toString() && h.subjectId.toString() === subjectId.toString() && h.teacherId.toString() === teacher._id.toString())

							const from = history ? new Date(history.fromDate) : startOfMonth
							const to = history && history.toDate ? new Date(history.toDate) : endOfMonth

							const attendance = []
							for (const d of allLessonDates) {
								const dateStr = d.toISOString().split('T')[0]
								if (d < from || d > to) {
									attendance.push({ date: d, Status: 'Ishtirok etmagan', score: 0, sunday: false })
								} else if (attendanceMap.has(dateStr)) {
									attendance.push(attendanceMap.get(dateStr))
								} else if (teacherAbsentDates.includes(dateStr)) {
									attendance.push({ date: d, Status: 'Ustoz', score: 0, sunday: false })
								} else {
									attendance.push({ date: d, Status: 'Ishtirok etmagan', score: 0, sunday: false })
								}
							}

							const main = student.main_subjects?.find(s => s.groupId.toString() === group._id.toString())
							const additional = student.additionalSubjects?.find(s => s.groupId.toString() === group._id.toString())
							const price = main?.price || additional?.price || 0
							const ulush = price * (currentShare / 100)

							const kelganCount = attendance.filter(a => a.Status === "Kelgan").length
							const kelmaganCount = attendance.filter(a => a.Status === "Kelmagan").length
							const kelmaganKechirilgan = Math.min(2, kelmaganCount)
							const darslarSoni = kelganCount + kelmaganKechirilgan
							const darsKuniSoni = attendance.filter(a => ["Kelgan", "Kelmagan", "Ustoz"].includes(a.Status)).length

							let hisoblanma = 0
							if (darsKuniSoni && darslarSoni) {
								hisoblanma = (ulush / darsKuniSoni) * darslarSoni
							}

							totalHisoblanma += hisoblanma

							studentsWithAttendance.push({
								studentId: student._id.toString(),
								fullName: student.fullName,
								attendance,
								price,
								teacherAbsentDates
							})
						}

						let totalDays = 0
						for (const s of studentsWithAttendance) {
							const count = s.attendance.filter(a => ["Kelgan", "Kelmagan", "Ustoz"].includes(a.Status)).length
							if (count > totalDays) totalDays = count
						}

						groupData.push({
							groupId: group._id.toString(),
							groupName: group.groupName,
							students: studentsWithAttendance,
							totalDays
						})
					}

					if (groupData.length) {
						subjectEntries.push({
							subjectId: subjectId.toString(),
							subjectName: groups[0]?.subject?.subjectName || 'Noma’lum fan',
							groups: groupData
						})
					}
				}

				result.push({
					teacherId: teacher._id.toString(),
					teacherName: teacher.fullName,
					salary: currentSalary,
					share_of_salary: currentShare / 100,
					totalCalculated: Number((currentSalary + totalHisoblanma).toFixed(2)),
					subjects: subjectEntries
				})
			}

			return { success: true, data: result }
		} catch (err) {
			console.error(err)
			return { success: false, message: 'Ichki xatolik yuz berdi' }
		}
	}



	// teacherSalary.service.js



async getOneTeacherSalary({ year, month, teacherId }) {
	try {
		let newYear = Number(year);
		let newMonth = Number(month);

		if (
			isNaN(newYear) || isNaN(newMonth) ||
			newYear < 2000 || newYear > 2100 ||
			newMonth < 1 || newMonth > 12 || !teacherId
		) {
			return { success: false, message: "Yil, oy yoki o‘qituvchi ID noto‘g‘ri." };
		}

		// 🔁 Hozirgi oydan oldingi oyni olish
		const prevDate = new Date(newYear, newMonth - 1, 1);
		prevDate.setMonth(prevDate.getMonth() - 1);
		newYear = prevDate.getFullYear();
		newMonth = prevDate.getMonth() + 1;

		const startOfMonth = new Date(newYear, newMonth - 1, 1);
		const endOfMonth = new Date(newYear, newMonth, 0, 23, 59, 59);

		const teacher = await teacherModel.findById(teacherId);
		if (!teacher) return { success: false, message: "O‘qituvchi topilmadi." };

		const getSalaryVersion = (salaryHistory, date) => {
			if (!Array.isArray(salaryHistory)) return null;
			return salaryHistory
				.filter(v => new Date(v.from) <= date)
				.sort((a, b) => new Date(b.from) - new Date(a.from))[0] || null;
		};

		const version = getSalaryVersion(teacher.salaryHistory, endOfMonth);
		const currentSalary = version?.salary || teacher.salary || 0;
		const currentShare = version?.share_of_salary || teacher.share_of_salary || 0;

		let totalHisoblanma = 0;

		const allStudents = await studentModel.find().select('fullName main_subjects additionalSubjects main_subject_history additional_subject_history createdAt');

		for (const subjectId of teacher.subjects) {
			const groups = await groupModel.find({ teacher: teacherId, subject: subjectId })
				.populate('students')
				.populate('subject');

			for (const group of groups) {
				const teacherAbsences = await teacherattendanceModel.find({
					teacher: teacherId,
					subject: subjectId,
					group: group._id,
					date: { $gte: startOfMonth, $lte: endOfMonth }
				});

				const teacherAbsentDates = teacherAbsences.map(item =>
					item.date.toISOString().split('T')[0]
				);

				const studentsInGroup = new Map();

				for (const student of allStudents) {
					const histories = [...(student.main_subject_history || []), ...(student.additional_subject_history || [])];
					for (const h of histories) {
						const isSameGroup = h.groupId?.toString() === group._id.toString();
						const isSameTeacher = h.teacherId?.toString() === teacherId;
						const isSameSubject = h.subjectId?.toString() === subjectId.toString();
						if (!isSameGroup || !isSameTeacher || !isSameSubject) continue;

						const from = new Date(h.fromDate);
						const to = h.toDate ? new Date(h.toDate) : endOfMonth;
						if (from <= endOfMonth && to >= startOfMonth) {
							studentsInGroup.set(student._id.toString(), student);
						}
					}
				}

				const allLessonDates = [];
				for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
					if (d.getDay() !== 0) allLessonDates.push(new Date(d));
				}

				for (const student of studentsInGroup.values()) {
					if (student.createdAt && new Date(student.createdAt) > endOfMonth) continue;

					const attendanceRaw = await attandanceModel.find({
						studentId: student._id,
						groupId: group._id,
						date: { $gte: startOfMonth, $lte: endOfMonth }
					});

					const attendanceMap = new Map(attendanceRaw.map(a =>
						[a.date.toISOString().split('T')[0], a]
					));

					const history = [...(student.main_subject_history || []), ...(student.additional_subject_history || [])]
						.find(h => h.groupId.toString() === group._id.toString() &&
							h.subjectId.toString() === subjectId.toString() &&
							h.teacherId.toString() === teacherId);

					const from = history ? new Date(history.fromDate) : startOfMonth;
					const to = history?.toDate ? new Date(history.toDate) : endOfMonth;

					const attendance = [];
					for (const d of allLessonDates) {
						const dateStr = d.toISOString().split('T')[0];
						if (d < from || d > to) {
							attendance.push({ Status: 'Ishtirok etmagan' });
						} else if (attendanceMap.has(dateStr)) {
							attendance.push(attendanceMap.get(dateStr));
						} else if (teacherAbsentDates.includes(dateStr)) {
							attendance.push({ Status: 'Ustoz' });
						} else {
							attendance.push({ Status: 'Ishtirok etmagan' });
						}
					}

					const price = student.main_subjects?.find(s => s.groupId.toString() === group._id.toString())?.price ||
						student.additionalSubjects?.find(s => s.groupId.toString() === group._id.toString())?.price || 0;

					const ulush = price * (currentShare / 100);

					const kelganCount = attendance.filter(a => a.Status === 'Kelgan').length;
					const kelmaganCount = attendance.filter(a => a.Status === 'Kelmagan').length;
					const kelmaganKechirilgan = Math.min(2, kelmaganCount);
					const darslarSoni = kelganCount + kelmaganKechirilgan;
					const darsKuniSoni = attendance.filter(a => ['Kelgan', 'Kelmagan', 'Ustoz'].includes(a.Status)).length;

					let hisoblanma = 0;
					if (darsKuniSoni && darslarSoni) {
						hisoblanma = (ulush / darsKuniSoni) * darslarSoni;
					}

					totalHisoblanma += hisoblanma;
				}
			}
		}

		const totalCalculated = Number((currentSalary + totalHisoblanma).toFixed(2));
		const maxAvans = Number((totalCalculated * 0.65).toFixed(2));

		return {
			success: true,
			data: {
				teacherId,
				teacherName: teacher.fullName,
				year: newYear,
				month: newMonth,
				totalSalary: totalCalculated,
				maxAvans
			}
		};
	} catch (err) {
		console.error('Hisoblashda xatolik:', err.message);
		return { success: false, message: 'Ichki xatolik yuz berdi.' };
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