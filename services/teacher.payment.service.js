const teacherPaymentModel = require('../modules/teacherPayment.model')

class TeacherPaymentService {
	async create(data) {
		try {
			console.log(data)
			const payment = await teacherPaymentModel.create(data)
			if (payment) {
				return { success: true, payment, message: "teacherning oyligi saqlandi" }
			} else {
				return { success: false, message: "To'lov qilishda xatolik" }
			}
		} catch (error) {
			throw new Error(error.message)
		}
	}
	async paymentcheck({ teacherId, year, month }) {
		try {
			console.log(teacherId)
			console.log(year)
			console.log(month)
			const payment = await teacherPaymentModel.findOne({
				teacherId, year, month
			})
			if (payment) {
				if (payment.status === 'paid') {
					return { success: true, tulov: true, message: "Oylik berib bo'lingan" }
				}else{
					return { success: true, tulov: false, message: "Oylik berilmagan" }
				}
			} else {
				return { success: true, tulov: false, message: "Oylik berilmagan" }
			}
		} catch (error) {
			throw new Error(error.message)
		}
	}
}
module.exports = new TeacherPaymentService()