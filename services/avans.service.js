const avansModel = require('../modules/avans.model')

class AvansService {
	async create(data) {
		try {
			const newAvans = await avansModel.create(data)
			if (newAvans) {
				return { success: true, message: "Avans qo'shildi", avans: newAvans }
			}
			return { success: false, message: "Avans qo'shishda xatolik mavjud" }
		} catch (error) {
			throw new Error(error.message)
		}
	}
	async getAll() {
		try {
			const Avanses = await avansModel.find()
			if (Avanses) {
				return { success: true, avanses: Avanses, message: "Hamma avanslar" }
			}
			return { success: false, message: "Avanslar topilmadi" }
		} catch (error) {
			throw new Error(error.message)
		}
	}
	async teacherAvansInMonth(data) {
		try {
			const { year, month, teacherId } = data
			const realMonth = month - 1 // Oy 0-indekslangan bo'lishi kerak

			const startDate = new Date(year, realMonth, 1)
			const endDate = new Date(year, realMonth + 1, 1)

			const avanses = await avansModel.find({
				teacherId,
				date: {
					$gte: startDate,
					$lt: endDate
				}
			})

			if (!avanses || avanses.length === 0) {
				return {
					success: true,
					avans: 0
				}
			}

			const totalAvans = avanses.reduce((sum, item) => sum + item.amount, 0)

			return {
				success: true,
				avans: totalAvans
			}
		} catch (error) {
			throw new Error(error.message)
		}
	}



}
module.exports = new AvansService()