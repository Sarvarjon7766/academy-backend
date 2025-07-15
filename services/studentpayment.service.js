const { default: mongoose } = require('mongoose')
const studentModel = require('../modules/student.model')
const studentpaymentModel = require('../modules/StudentPayment.model')
const studentPaymentTransactionModel = require('../modules/StudentPaymentTransaction.model')

class StudentPaymentService {
	async MonthlyBill() {
		try {
			const date = new Date()
			const year = date.getFullYear()
			const month = date.getMonth() + 1

			const startOfMonth = new Date(year, month - 1, 1)
			const endOfMonth = new Date(year, month, 0)
			const totalDaysInMonth = endOfMonth.getDate()

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
				let amountDue = 0
				const details = []

				// === Asosiy fanlar ===
				for (const subj of student.main_subject_history || []) {
					const from = new Date(subj.fromDate)
					const to = subj.toDate ? new Date(subj.toDate) : endOfMonth

					const start = new Date(Math.max(from.getTime(), startOfMonth.getTime()))
					const end = new Date(Math.min(to.getTime(), endOfMonth.getTime()))

					if (start <= end) {
						const activeDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1
						const dailyPrice = subj.price / totalDaysInMonth
						const monthlyAmount = Math.round(dailyPrice * activeDays)

						amountDue += monthlyAmount
						details.push({
							type: 'subject',
							label: 'Asosiy fan',
							amount: monthlyAmount,
							comment: `subject uchun to'lov ${subj.price} so'm, qatnashgan kunlar: ${activeDays}, hisoblangan: ${monthlyAmount} so'm`
						})
					}
				}

				// === Qo‘shimcha fanlar ===
				for (const subj of student.additional_subject_history || []) {
					const from = new Date(subj.fromDate)
					const to = subj.toDate ? new Date(subj.toDate) : endOfMonth

					const start = new Date(Math.max(from.getTime(), startOfMonth.getTime()))
					const end = new Date(Math.min(to.getTime(), endOfMonth.getTime()))

					if (start <= end) {
						const activeDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1
						const dailyPrice = subj.price / totalDaysInMonth
						const monthlyAmount = Math.round(dailyPrice * activeDays)

						amountDue += monthlyAmount
						details.push({
							type: 'subject',
							label: 'Qo‘shimcha fan',
							amount: monthlyAmount,
							comment: `subject uchun to'lov ${subj.price} so'm, qatnashgan kunlar: ${activeDays}, hisoblangan: ${monthlyAmount} so'm`
						})
					}
				}

				// === Yotoqxona ===
				for (const h of student.hostel_history || []) {
					const from = new Date(h.fromDate)
					const to = h.toDate ? new Date(h.toDate) : endOfMonth

					const start = new Date(Math.max(from.getTime(), startOfMonth.getTime()))
					const end = new Date(Math.min(to.getTime(), endOfMonth.getTime()))

					if (start <= end) {
						const activeDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1
						const dailyPrice = h.price / totalDaysInMonth
						const monthlyAmount = Math.round(dailyPrice * activeDays)

						amountDue += monthlyAmount
						details.push({
							type: 'hostel',
							label: 'Yotoqxona',
							amount: monthlyAmount,
							comment: `hostel uchun to'lov ${h.price} so'm, qatnashgan kunlar: ${activeDays}, hisoblangan: ${monthlyAmount} so'm`
						})
					}
				}

				// === Transport ===
				for (const t of student.transport_history || []) {
					const from = new Date(t.fromDate)
					const to = t.toDate ? new Date(t.toDate) : endOfMonth

					const start = new Date(Math.max(from.getTime(), startOfMonth.getTime()))
					const end = new Date(Math.min(to.getTime(), endOfMonth.getTime()))

					if (start <= end) {
						const activeDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1
						const dailyPrice = t.price / totalDaysInMonth
						const monthlyAmount = Math.round(dailyPrice * activeDays)

						amountDue += monthlyAmount
						details.push({
							type: 'transport',
							label: 'Transport',
							amount: monthlyAmount,
							comment: `transport uchun to'lov ${t.price} so'm, qatnashgan kunlar: ${activeDays}, hisoblangan: ${monthlyAmount} so'm`
						})
					}
				}

				// === Mahsulotlar ===
				for (const p of student.product_history || []) {
					const from = new Date(p.fromDate)
					const to = p.toDate ? new Date(p.toDate) : endOfMonth

					const start = new Date(Math.max(from.getTime(), startOfMonth.getTime()))
					const end = new Date(Math.min(to.getTime(), endOfMonth.getTime()))

					if (start <= end) {
						const activeDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1
						const dailyPrice = p.price / totalDaysInMonth
						const monthlyAmount = Math.round(dailyPrice * activeDays)

						amountDue += monthlyAmount
						details.push({
							type: 'product',
							label: 'Mahsulot',
							amount: monthlyAmount,
							comment: `product uchun to'lov ${p.price} so'm, qatnashgan kunlar: ${activeDays}, hisoblangan: ${monthlyAmount} so'm`
						})
					}
				}

				// === Mavjud payment borligini tekshiramiz ===
				const existingPayment = await studentpaymentModel.findOne({ student: student._id, year, month })

				if (existingPayment) {
					existingPayment.amount_due = amountDue
					existingPayment.details = details
					existingPayment.balance = existingPayment.amount_paid - amountDue
					existingPayment.isPaid = existingPayment.amount_paid >= amountDue
					await existingPayment.save()
					payments.push(existingPayment)
				} else {
					const newPayment = await studentpaymentModel.create({
						student: student._id,
						year,
						month,
						amount_due: amountDue,
						amount_paid: 0,
						balance: -amountDue,
						isPaid: false,
						details
					})
					payments.push(newPayment)
				}
			}

			return {
				success: true,
				message: `Muvaffaqiyatli. ${payments.length} ta talaba uchun payment hisoblandi yoki yangilandi.`,
			}

		} catch (error) {
			console.error('MonthlyBill error:', error)
			return { success: false, message: 'Xatolik yuz berdi' }
		}
	}


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
				month: data.month,
				isActive:'active'
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
	async resgistratationPaymentHistory(data) {
		try {
			console.log(data)
			if (!data?.student || !data?.amount_due) {
				return { success: false, message: "Kerakli ma'lumotlar to‘liq emas" }
			}

			const now = new Date()
			const year = now.getFullYear()
			const month = now.getMonth() + 1

			// Studentni alohida o‘zgaruvchiga ajratamiz
			const studentId = data.student

			// Avval mavjud to‘lov yozuvini qidiramiz
			const payment = await studentpaymentModel.findOne({
				student: studentId,
				year,
				month,
			})

			// Agar mavjud bo‘lsa - update
			if (payment) {
				payment.amount_due = data.amount_due
				await payment.save()
				return { success: true, message: "To'lov yangilandi", payment }
			}

			// Aks holda - yangi yozuv yaratamiz
			const newPayment = await studentpaymentModel.create({
				student: studentId,
				amount_due: data.amount_due,
				amount_paid: data.amount_paid,
				year,
				month,
			})

			return { success: true, message: "Yangi to‘lov yaratildi", payment: newPayment }
		} catch (error) {
			console.error(error)
			return { success: false, message: "Xatolik yuz berdi" }
		}
	}
	async StudentBill(studentId) {
		try {
			const student = await studentModel.findById(studentId)
			if (!student) return { success: false, message: 'Talaba topilmadi' }

			const createdAt = new Date(student.createdAt)
			const now = new Date()
			const currentYear = now.getFullYear()
			const currentMonth = now.getMonth() + 1
			const currentDay = now.getDate()

			const payments = await studentpaymentModel.find({ student: studentId })

			const historyFields = [
				{ list: student.main_subject_history, type: 'subject', label: 'Asosiy fan' },
				{ list: student.additional_subject_history, type: 'subject', label: 'Qo‘shimcha fan' },
				{ list: student.hostel_history, type: 'hostel', label: 'Yotoqxona' },
				{ list: student.transport_history, type: 'transport', label: 'Transport' },
				{ list: student.product_history, type: 'product', label: 'Mahsulot' }
			]

			const startYear = createdAt.getFullYear()
			const startMonth = createdAt.getMonth() + 1
			const months = []

			for (let y = startYear; y <= currentYear; y++) {
				const fromMonth = y === startYear ? startMonth : 1
				const toMonth = y === currentYear ? currentMonth : 12

				for (let m = fromMonth; m <= toMonth; m++) {
					const isCurrent = y === currentYear && m === currentMonth
					const startOfMonth = new Date(y, m - 1, 1)
					const endOfMonth = isCurrent
						? new Date(currentYear, currentMonth - 1, currentDay)
						: new Date(y, m, 0)
					const totalDaysInMonth = new Date(y, m, 0).getDate()

					let due = 0
					const details = []

					const matched = payments.find(p => p.year === y && p.month === m)

					if (isCurrent) {
						for (const field of historyFields) {
							for (const item of field.list || []) {
								const from = new Date(item.fromDate)
								const to = item.toDate ? new Date(item.toDate) : endOfMonth

								const start = new Date(Math.max(from.getTime(), startOfMonth.getTime()))
								const end = new Date(Math.min(to.getTime(), endOfMonth.getTime()))

								if (start <= end) {
									const activeDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1
									const dailyPrice = item.price / totalDaysInMonth
									const monthlyAmount = Math.round(dailyPrice * activeDays)

									due += monthlyAmount

									details.push({
										type: field.type,
										label: field.label,
										amount: monthlyAmount,
										comment: `${field.label} uchun to'lov ${item.price} so'm, qatnashgan kunlar: ${activeDays}, hisoblangan: ${monthlyAmount} so'm`
									})
								}
							}
						}
					} else {
						due = matched?.amount_due || 0
						details.push(...(matched?.details || []))
					}

					const paid = matched?.amount_paid || 0
					const balance =due - paid

					months.push({
						year: y,
						month: m,
						due,
						paid,
						balance,
						status: paid >= due ? 'To‘langan' : 'Qarzdor',
						paymentId: matched?._id || null,
						...(isCurrent ? { details } : {})
					})
				}
			}

			return {
				success: true,
				data: {
					studentId,
					fullName: student.fullName,
					months
				}
			}
		} catch (error) {
			console.error('StudentBill error:', error)
			return { success: false, message: 'Xatolik yuz berdi' }
		}
	}




	async paymentHistory(data) {
		try {
			const payment = data.payment._id
			const paymentlogs = await studentPaymentTransactionModel.find({ payment })
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
	async BillPaymentStudent(data) {
		try {
			console.log(data)
			if (!data?.paymentId || !data?.amount || !data?.selectedId) {
				return { success: false, message: "Kerakli ma'lumotlar to‘liq emas" }
			}

			const paymentlog = await studentPaymentTransactionModel.create({
				student: new mongoose.Types.ObjectId(data.selectedId),
				payment: new mongoose.Types.ObjectId(data.paymentId),
				amount: Number(data.amount),
				comment: data.comment || ""
			})

			if (paymentlog) {
				const payment = await studentpaymentModel.findById(data.paymentId)
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