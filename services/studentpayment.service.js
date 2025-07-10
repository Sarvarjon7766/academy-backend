const { default: mongoose } = require('mongoose')
const studentModel = require('../modules/student.model')
const studentpaymentModel = require('../modules/StudentPayment.model')
const studentPaymentTransactionModel = require('../modules/StudentPaymentTransaction.model')

class StudentPaymentService {
	async paymentCreate() {
		try {
			const date = new Date()
			const year = date.getFullYear()
			const month = date.getMonth() + 1
			const populateFields = [
				{ path: 'hostel', select: 'hostelName hostelPrice' },
				{ path: 'transport', select: 'transportName transportPrice' },
				{ path: 'product', select: 'productName productPrice' }
			]
			let query = studentModel.find({ status: 'active' })
			for (const pop of populateFields) {
				query = query.populate(pop)
			}
			const students = await query.exec()
			const payments = []
			for (const student of students) {
				// Shu studentga shu oy uchun allaqachon yaratilgan bo‘lsa, o‘tkazib yuboramiz
				const alreadyExists = await studentpaymentModel.exists({
					student: student._id,
					year,
					month,
				})
				if (alreadyExists) continue // O‘tkazib yubor
				let amountDue = 0
				// 1. Asosiy fanlar
				for (const subj of student.main_subjects || []) {
					if (subj.price && subj.price > 0) amountDue += subj.price
				}
				// 2. Qo‘shimcha fanlar
				for (const subj of student.additionalSubjects || []) {
					if (subj.price && subj.price > 0) amountDue += subj.price
				}
				// 3. Yotoqxona
				if (student.hostel?.hostelPrice > 0) {
					amountDue += student.hostel.hostelPrice
				}
				// 4. Transport
				if (student.transport?.transportPrice > 0) {
					amountDue += student.transport.transportPrice
				}
				// 5. Mahsulot
				if (student.product?.productPrice > 0) {
					amountDue += student.product.productPrice
				}
				const newPayment = await studentpaymentModel.create({
					student: student._id,
					year,
					month,
					amount_due: amountDue,
					amount_paid: 0,
					isPaid: false,
					details: []
				})
				payments.push(newPayment)
			}
			return {
				success: true,
				message: `Muvaffaqiyatli yaratildi. ${payments.length} ta yangi payment qo‘shildi.`,
			}

		} catch (error) {
			console.error("paymentCreate error:", error)
			return { success: false, message: "Xatolik yuz berdi" }
		}
	}
	async getPayments(data) {
		try {
			const payments = await studentpaymentModel.find({
				year: data.year,
				month: data.month
			}).populate('student', 'fullName address phone')

			if (payments) {
				return { success: true, message: "To'lov hisobotlari", payments }
			} else {
				return { success: true, message: "To'lov hisobotlari yo'q", payments: [] }
			}
		} catch (error) {
			return { success: false, message: "Xatolik yuz berdi" }
		}
	}
	async paymentHistory(data) {
		try {
			const payment = data.payment._id
			const paymentlogs = await studentPaymentTransactionModel.find({payment})
			if (paymentlogs) {
				return { success: true, message: "To'lov hisobotlari", paymentlogs }
			} else {
				return { success: true, message: "To'lov hisobotlari yo'q", paymentlogs: [] }
			}
		} catch (error) {
			return { success: false, message: "Xatolik yuz berdi" }
		}
	}
	async check(data) {
		try {
			const { studentId, year, month } = data
			const student = new mongoose.Types.ObjectId(studentId)
			const newyear = Number(year)
			const newmonth = Number(month)
			const payment = await studentpaymentModel.findOne({
				student,
				year: newyear,
				month: newmonth
			})
			if (payment) {
				return { success: true, message: "To'lov ma'lumotlari", payment }
			} else {
				return { success: true, message: "To'lov ma'lumotlari mavjud emas", payment: {} }
			}
		} catch (error) {
			return { success: false, message: "Xatolik yuz berdi" }
		}
	}
	async Pay(data) {
		try {
			if (!data?.studentId || !data?.payment || !data?.amount) {
				return { success: false, message: "Kerakli ma'lumotlar to‘liq emas" }
			}

			const paymentlog = await studentPaymentTransactionModel.create({
				student: new mongoose.Types.ObjectId(data.studentId),
				payment: new mongoose.Types.ObjectId(data.payment),
				amount: Number(data.amount),
				comment: data.comment || ""
			})

			if (paymentlog) {
				const payment = await studentpaymentModel.findById(data.payment)
				if (payment) {
					payment.amount_paid += Number(data.amount)
					await payment.save() // 'await' qo‘shildi
					return { success: true, message: "To‘lov muvaffaqiyatli qo‘shildi" }
				} else {
					return { success: false, message: "To‘lov topilmadi" }
				}
			} else {
				return { success: false, message: "To‘lov logi yaratilmadi" }
			}
		} catch (error) {
			console.error(error)
			return { success: false, message: "Xatolik yuz berdi", error: error.message }
		}
	}


}

module.exports = new StudentPaymentService()