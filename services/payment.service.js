const { default: mongoose } = require('mongoose')
const paymentModel = require('../modules/payment.model')
const studentModel = require('../modules/student.model')

class PaymentService {
	async create(data) {
		try {
			const newData = {
				...data,
				studentId: new mongoose.Types.ObjectId(data.studentId)
			}
			const payment = await paymentModel.create(newData)
			return { success: true, message: "To'lov yaratildi" }
		} catch (error) {
			return { success: false, message: error.message }
		}
	}
	async getAll() {
		try {

			const payment = await paymentModel.find()
			return { success: true, payment }
		} catch (error) {
			return { success: false, message: error.message }
		}
	}
	async checkPayment(data) {
		try {

			const id = new mongoose.Types.ObjectId(data.studentId)
			const payment = await paymentModel.findOne({ ...data, studentId: id })
			console.log(payment)
			if (payment) {
				return { success: true, payment }
			} else {
				const student = await studentModel.findById(id)
				let amountDue = 0

				const sumPrices = (items) => {
					if (!items || items.length === 0) return 0
					return items.reduce((acc, curr) => acc + (curr.price || 0), 0)
				}

				// ✅ To‘g‘ridan-to‘g‘ri hisoblash
				amountDue += sumPrices(student.main_subjects)
				amountDue += sumPrices(student.additionalSubjects)

				if (student.hostel && student.hostel_history?.length) {
					const activeHostel = student.hostel_history.filter(h => h.toDate === null)
					amountDue += sumPrices(activeHostel)
				}

				if (student.product && student.product_history?.length) {
					const activeProduct = student.product_history.filter(p => p.toDate === null)
					amountDue += sumPrices(activeProduct)
				}

				if (student.transport && student.transport_history?.length) {
					const activeTransport = student.transport_history.filter(t => t.toDate === null)
					amountDue += sumPrices(activeTransport)
				}
				return { success: true, message: "Hali to'lov qilinmagan", amountDue, payment: null }
			}


		} catch (error) {
			return { success: false, message: error.message }
		}
	}
	async MonthlyCheck(data) {
		try {
			const now = new Date()
			const nowyear = now.getFullYear()
			const nowmonth = now.getMonth() + 1

			const students = await studentModel.find({ status: "active" })
			const studentIds = students.map(student => student._id)
			const totalStudents = studentIds.length

			let newyear, newmonth
			const { year, month } = data

			if (year && month) {
				newyear = year
				newmonth = month
			} else {
				newyear = nowyear
				newmonth = nowmonth
			}

			// Shu yil va oyda to‘lov qilganlar
			const payments = await paymentModel.find({
				studentId: { $in: studentIds },
				year: newyear,
				month: newmonth
			})

			// To'lov qilganlar ID ro'yxati
			const paidStudentIds = payments.map(p => p.studentId.toString())

			// Unikal statuslar bo‘yicha hisoblash
			const paidStudents = payments.filter(p => p.status === "To'langan").length
			const partialStudents = payments.filter(p => p.status === "To'lanmoqda").length
			const unpaidStudents = payments.filter(p => p.status === "To'lanmagan").length

			// To‘lov ma’lumoti yo‘q bo‘lganlar
			const notFoundStudents = studentIds.filter(id => !paidStudentIds.includes(id.toString())).length

			// Umuman to‘lov qilmaganlar
			const completelyUnpaidStudents = unpaidStudents + notFoundStudents

			return {
				success: true,
				totalStudents,
				paidStudents,
				partialStudents,
				completelyUnpaidStudents,
				notFoundStudents
			}
		} catch (error) {
			return { success: false, message: error.message }
		}
	}

	async Pay(data) {
		try {
			console.log(data)

			const id = new mongoose.Types.ObjectId(data.studentId)
			const student = await studentModel.findById(id) // ✅ Await qo‘shildi

			if (!student) {
				return { success: false, message: "Talaba topilmadi" }
			}

			let amountDue = 0

			const sumPrices = (items) => {
				if (!items || items.length === 0) return 0
				return items.reduce((acc, curr) => acc + (curr.price || 0), 0)
			}

			// ✅ To‘g‘ridan-to‘g‘ri hisoblash
			amountDue += sumPrices(student.main_subjects)
			amountDue += sumPrices(student.additionalSubjects)

			if (student.hostel && student.hostel_history?.length) {
				const activeHostel = student.hostel_history.filter(h => h.toDate === null)
				amountDue += sumPrices(activeHostel)
			}

			if (student.product && student.product_history?.length) {
				const activeProduct = student.product_history.filter(p => p.toDate === null)
				amountDue += sumPrices(activeProduct)
			}

			if (student.transport && student.transport_history?.length) {
				const activeTransport = student.transport_history.filter(t => t.toDate === null)
				amountDue += sumPrices(activeTransport)
			}

			const payment = await paymentModel.findOne({
				studentId: id,
				year: Number(data.year),
				month: Number(data.month)
			})

			if (!payment) {
				const newPayment = await paymentModel.create({
					studentId: id,
					year: Number(data.year),
					month: Number(data.month),
					amountPaid: Number(data.amount),
					amountDue: amountDue,
					status: Number(data.amount) >= amountDue ? "To'langan" : "To'lanmoqda"
				})
				return { success: true, payment: newPayment }
			} else {
				const oldAmount = payment.amountPaid || 0
				const addedAmount = Number(data.amount)
				const newAmountPaid = oldAmount + addedAmount
				const status = newAmountPaid >= payment.amountDue ? "To'langan" : "To'lanmoqda"

				payment.amountPaid = newAmountPaid
				payment.status = status

				await payment.save()
				return { success: true, payment }
			}

		} catch (error) {
			console.error(error)
			return { success: false, message: error.message }
		}
	}

	async Calculate({ months, studentId }) {
		const paymentRecords = await paymentModel.find({ studentId: new mongoose.Types.ObjectId(studentId) })

		const updatedPayments = []

		for (const payment of paymentRecords) {
			const monthKey = `${payment.year}-${payment.month.toString().padStart(2, '0')}`
			const monthInfo = months[monthKey]

			if (!monthInfo) continue

			const { totalDays, attendedDays } = monthInfo
			let refundableAmount = 0
			let dailyRate = 0
			let actualCost = 0

			// 3 va undan ortiq kun qatnashgan bo‘lsa, qatnashgan kunlar uchun hisobla
			if (attendedDays >= 3) {
				dailyRate = payment.amountDue / totalDays
				actualCost = dailyRate * attendedDays
				refundableAmount = Math.round(payment.amountPaid - actualCost)
			} else {
				// 1 yoki 2 kun qatnashgan bo‘lsa, to‘liq qaytariladi
				refundableAmount = payment.amountPaid
				actualCost = 0
			}

			// Ma'lumotlarni saqlash
			payment.totalDaysinMonth = totalDays
			payment.daysAttended = attendedDays
			payment.refundableAmount = refundableAmount

			await payment.save()

			updatedPayments.push({
				month: monthKey,
				amountDue: payment.amountDue,
				amountPaid: payment.amountPaid,
				daysAttended: attendedDays,
				totalDays,
				refundableAmount,
				status: payment.status
			})
		}

		return {
			success: true,
			data: updatedPayments
		}
	}

}

module.exports = new PaymentService()