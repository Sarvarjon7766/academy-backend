const jwt = require('jsonwebtoken')
const { default: mongoose } = require('mongoose')
const teacherattandanceModel = require('../modules/teacherattandance.model')


class TeacherAttandanceService {
	async attandanceAdd(data) {
		try {
			const { teacher, subject, group } = data
			const today = new Date()
			const onlyDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())

			// Avval shu kunga tegishli mavjud davomatni tekshiramiz
			const existing = await teacherattandanceModel.findOne({
				teacher,
				subject,
				group,
				date: onlyDate
			})

			if (existing) {
				return { success: true, data:{message: "Bugun uchun davomat allaqachon olingan." }}
			}

			// Davomat mavjud emas — yangisini yaratamiz
			const attandance = await teacherattandanceModel.create({
				...data,
				date: onlyDate
			})

			return { success: true, data: {...attandance,message:'Davomatga olindi'} }
		} catch (error) {
			return { success: false, error }
		}
	}

	async AllAttandance() {
		try {
			const attandance = await teacherattandanceModel.find()
				.populate('group')
				.populate('subject')
				.populate('teacher')

			return { success: true, data: attandance }
		} catch (error) {
			return { success: false, error }
		}
	}



}


module.exports = new TeacherAttandanceService()