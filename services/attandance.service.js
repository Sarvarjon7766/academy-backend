const { default: mongoose } = require('mongoose')
const attandanceModel = require('../modules/attandance.model')
const { groupForStudents } = require('./group.service')
const groupModel = require('../modules/group.model')
const studentModel = require('../modules/student.model')

class AttandanceService {
	async create(data) {
		try {
			if (!data || !data.attendance || !data.gId) {
				return { success: false, message: "Noto‘g‘ri ma'lumot yuborildi!" }
			}
			const now = new Date()
			const year = now.getFullYear()
			const month = String(now.getMonth() + 1).padStart(2, '0')
			const day = String(now.getDate()).padStart(2, '0')
			const localDate = `${year}-${month}-${day}`
			const { attendance, gId } = data
			const guruhId = new mongoose.Types.ObjectId(gId?.groupId)
			console.log(guruhId)
			const promises = Object.keys(attendance).map(async (key) => {
				if (!attendance[key] || typeof attendance[key] !== "object") {
					console.warn(`Talaba ID ${key} uchun noto‘g‘ri attendance ma'lumot!`)
					return null
				}
				return attandanceModel.create({
					groupId: guruhId,
					studentId: new mongoose.Types.ObjectId(key),
					Status: attendance[key].attended ? "Kelgan" : "Kelmagan",
					score: attendance[key].grade || 0, // score bo‘lmasa 0 bo‘lsin
					date: localDate
				})
			})
			await Promise.all(promises.filter(Boolean))
			return { success: true, message: "Davomat saqlandi" }
		} catch (error) {
			console.error("Xatolik:", error)
			return { success: false, message: error.message }
		}
	}
	async createSunday(data) {
		try {
			console.log(data)
			if (!data || !data.attendance || !data.date) {
				return { success: false, message: "Noto‘g‘ri ma'lumot yuborildi!" }
			}
			const { attendance, date } = data
			const guruhId = null
			const promises = Object.keys(attendance).map(async (key) => {
				if (!attendance[key] || typeof attendance[key] !== "object") {
					console.warn(`Talaba ID ${key} uchun noto‘g‘ri attendance ma'lumot!`)
					return null
				}
				return attandanceModel.create({
					groupId: guruhId,
					studentId: new mongoose.Types.ObjectId(key),
					Status: attendance[key].attended ? "Kelgan" : "Kelmagan",
					score: attendance[key].grade || 0, // score bo‘lmasa 0 bo‘lsin
					date,
					sunday: true
				})
			})
			await Promise.all(promises.filter(Boolean))
			return { success: true, message: "Davomat saqlandi" }
		} catch (error) {
			console.error("Xatolik:", error)
			return { success: false, message: error.message }
		}
	}

	async ChekingAttandance(guruhId, teacherid) {
		try {
			if (guruhId) {
				const now = new Date()
				const year = now.getFullYear()
				const month = String(now.getMonth() + 1).padStart(2, '0')
				const day = String(now.getDate()).padStart(2, '0')
				const localDate = `${year}-${month}-${day}`
				const groupId = new mongoose.Types.ObjectId(guruhId)
				const checking = await attandanceModel.findOne({ groupId, date:localDate })
				const students = await groupForStudents(groupId)
				if (checking) {
					return { success: false, message: "Bugun davomat olinib bo'lingan", students: students.students }
				}
				if (students.success) {
					return { success: true, message: "Davomat oling", students: students.students }
				}
				return { success: false, messeage: "Bu guruhda talaba mavjud emas" }
			}
		} catch (error) {
			return { success: false, message: error.message }
		}
	}
	async checkingSundayAttandance(sunday, date) {
		try {
			const checking = await attandanceModel.find({ sunday, date })
			console.log(checking)
			if (checking.length !== 0) {
				return { success: false, message: "Bugun davomat olinib bo'lingan" }
			} else {
				return { success: true, message: "Davomat olishingiz mumkin" }
			}
		} catch (error) {
			return { success: false, message: error.message }
		}
	}

	async getAttandanceForYear(teacherId, year) {
		try {
			const id = new mongoose.Types.ObjectId(teacherId)

			const groups = await groupModel.find({ teacher: id }).select('_id')

			const groupIds = groups.map(group => group._id)
			const startOfYear = new Date(year, 0, 1)
			const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999)

			const data = await attandanceModel.aggregate([
				{
					$match: {
						groupId: { $in: groupIds },
						date: { $gte: startOfYear, $lt: endOfYear }
					}
				},
				{
					$group: {
						_id: { $month: "$date" },
						kelganlar_soni: {
							$sum: { $cond: [{ $eq: ["$Status", "Kelgan"] }, 1, 0] }
						},
						kelmaganlar_soni: {
							$sum: { $cond: [{ $eq: ["$Status", "Kelmagan"] }, 1, 0] }
						},
						jami_score: { $sum: "$score" },
						kelganlar_score_sum: {
							$sum: { $cond: [{ $eq: ["$Status", "Kelgan"] }, "$score", 0] }
						},
						kelganlar_count: {
							$sum: { $cond: [{ $eq: ["$Status", "Kelgan"] }, 1, 0] }
						}
					}
				},
				{
					$project: {
						oy: "$_id",
						kelganlar_soni: 1,
						kelmaganlar_soni: 1,
						jami_score: 1,
						ortacha_score: {
							$cond: [{ $eq: ["$kelganlar_count", 0] }, 0, { $divide: ["$kelganlar_score_sum", "$kelganlar_count"] }]
						}
					}
				},
				{ $sort: { oy: 1 } }
			])

			if (data) {
				return { success: true, data }
			}
			return { success: false, message: "error" }

		} catch (error) {
			return { success: false, message: error.message }
		}

	}
	async lowAchievingStudents(teacherId, year, month) {
		try {
			const id = new mongoose.Types.ObjectId(teacherId)

			const groups = await groupModel.find({ teacher: id }).select('_id')

			const groupIds = groups.map(group => group._id)
			const startOfMonth = new Date(year, month - 1, 1)
			const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999)

			const data = await attandanceModel.aggregate([
				{
					$match: {
						groupId: { $in: groupIds },
						date: { $gte: startOfMonth, $lte: endOfMonth }
					}
				},
				{
					$group: {
						_id: "$studentId",
						full_score_sum: {
							$sum: { $cond: [{ $eq: ["$Status", "Kelgan"] }, "$score", 0] }
						},
						kelgan_kunlar: {
							$sum: { $cond: [{ $eq: ["$Status", "Kelgan"] }, 1, 0] }
						},
						jami_darslar: { $sum: 1 } // Jami yozilgan darslar soni
					}
				},
				{
					$lookup: {
						from: "students",
						localField: "_id",
						foreignField: "_id",
						as: "studentInfo"
					}
				},
				{
					$unwind: "$studentInfo"
				},
				{
					$project: {
						fullName: "$studentInfo.fullName",
						ortacha_score: {
							$cond: [
								{ $eq: ["$kelgan_kunlar", 0] }, 0,
								{ $divide: ["$full_score_sum", "$kelgan_kunlar"] }
							]
						},
						darsdagi_faollik: {
							$cond: [
								{ $eq: ["$jami_darslar", 0] }, 0,
								{ $multiply: [{ $divide: ["$kelgan_kunlar", "$jami_darslar"] }, 100] }
							]
						}
					}
				},
				{ $sort: { ortacha_score: 1 } },
				{ $limit: 7 }
			])
			if (data) {
				return { success: true, data }
			}
			return { success: false, message: "error" }

		} catch (error) {
			return { success: false, message: error.message }
		}
	}
	async Calculate({ studentId, date }) {
		try {
			const student = await studentModel.findById(studentId)
			if (!student) throw new Error('Student topilmadi')

			const startDate = student.createdAt
			const end = date ? new Date(date) : new Date()

			const attendanceRecords = await attandanceModel.find({
				studentId,
				date: { $gte: startDate, $lte: end }
			}).select('date status')

			const dayStatusMap = new Map()

			attendanceRecords.forEach(record => {
				const dayKey = record.date.toISOString().slice(0, 10)
				if (!dayStatusMap.has(dayKey)) {
					dayStatusMap.set(dayKey, [])
				}
				dayStatusMap.get(dayKey).push(record.status)
			})

			const attendanceByDay = {}
			for (const [day, statuses] of dayStatusMap.entries()) {
				attendanceByDay[day] = statuses.includes('Kelgan') ? 'Kelgan' : 'Kelmagan'
			}

			function getMonthYear(day) {
				return day.slice(0, 7)
			}

			const months = []
			let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
			while (current <= end) {
				months.push(new Date(current))
				current.setMonth(current.getMonth() + 1)
			}

			const result = {}

			months.forEach(m => {
				const year = m.getFullYear()
				const month = m.getMonth() + 1
				const key = `${year}-${month.toString().padStart(2, '0')}`

				// Oy boshlanishi va oxiri
				const monthStart = new Date(year, month - 1, 1)
				const monthEnd = new Date(year, month, 0)

				const totalDays = Math.ceil((monthEnd - monthStart) / (1000 * 60 * 60 * 24)) + 1

				result[key] = {
					totalDays,
					attendedDays: 0,
					missedDays: 0
				}
			})

			for (const [day, status] of Object.entries(attendanceByDay)) {
				const monthKey = getMonthYear(day)
				if (result[monthKey]) {
					if (status === 'Kelmagan') {
						result[monthKey].attendedDays += 1
					} else {
						result[monthKey].missedDays += 1
					}
				}
			}

			return { success: true, result }

		} catch (error) {
			console.error(error)
			throw error
		}
	}
}

module.exports = new AttandanceService()