const attandanceModel = require('../modules/attandance.model')
const employerModel = require('../modules/employer.model')
const groupModel = require('../modules/group.model')
const studentModel = require('../modules/student.model')
const subjectModel = require('../modules/subject.model')
const teacherModel = require('../modules/teacher.model')




class StatistiksService {
	async getStatistiks(data) {
		try {
			const student = await studentModel.find({ status: 'active' })
			console.log(student.length)
			const teacher = await teacherModel.find()
			console.log(teacher.length)
			const subject = await subjectModel.find()
			console.log(subject.length)
			const employer = await employerModel.find({ status: 'active' })
			console.log(employer.length)
			return { success: true, student: student.length, teacher: teacher.length, employer: employer.length, subject: subject.length, message: "Statistika ma'lumotlari" }


		} catch (error) {
			console.error("Xatolik:", error)
			return { success: false, message: "Ichki xatolik yuz berdi", studentId: null }
		}
	}
	async PaymentStatistiksMonth(data) {
		try {
			const { year, month } = data
			console.log(year)
			console.log(month)
			const students = await studentModel.find()
			console.log()
		} catch (error) {
			console.error("Xatolik:", error)
			return { success: false, message: "Ichki xatolik yuz berdi", studentId: null }
		}
	}
	async TeacherStatistiks(data) {
		try {
			const { year, month } = data
			const currentyear = Number(year)
			const currentmonth = Number(month)

			// Date oralig'i
			const startDate = new Date(currentyear, currentmonth - 1, 1)
			const endDate = new Date(currentyear, currentmonth, 1)

			// Baza so'rovlari
			const teachers = await teacherModel.find()
			const groups = await groupModel.find()
			const attendance = await attandanceModel.find({
				date: { $gte: startDate, $lt: endDate }
			})

			const result = []

			for (const teacher of teachers) {
				const teacherSubjectIds = teacher.subjects.map(id => id.toString())

				// Teacherning subjectlariga tegishli guruhlar
				const teacherGroups = groups.filter(group =>
					group.subject && teacherSubjectIds.includes(group.subject.toString())
				)

				const teacherStats = []

				for (const group of teacherGroups) {
					const groupId = group._id.toString()
					const studentIds = group.students.map(id => id.toString())

					for (const studentId of studentIds) {
						// Umumiy darslar soni (bu yerda har kungi 1 dars deb olamiz)
						const totalLessons = await attandanceModel.countDocuments({
							groupId,
							studentId,
							date: { $gte: startDate, $lt: endDate }
						})

						const attendedLessons = attendance.filter(a =>
							a.groupId?.toString() === groupId &&
							a.studentId?.toString() === studentId &&
							a.Status === 'Kelgan'
						).length

						teacherStats.push({
							studentId,
							groupId,
							subjectId: group.subject, // << Qo‘shilgan qism
							totalLessons,
							attendedLessons
						})
					}
				}

				result.push({
					teacherId: teacher._id,
					teacherStats
				})
			}
			console.log(result[1].teacherStats)

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

module.exports = new StatistiksService()