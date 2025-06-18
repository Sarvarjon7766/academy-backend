const jwt = require('jsonwebtoken')
const { default: mongoose } = require('mongoose')
const teacherattandanceModel = require('../modules/teacherattandance.model')


class TeacherAttandanceService {
async attandanceAdd(data) {
	try {
		console.log(data)
		const today = new Date();
		const onlyDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()); 

		const attandance = await teacherattandanceModel.create({
			...data,
			date: onlyDate
		});
		return { success: true, data: attandance };
	} catch (error) {
		return { success: false, error };
	}
}
async AllAttandance() {
	try {
const attandance = await teacherattandanceModel.find()
	.populate('group')
	.populate('subject')
	.populate('teacher')

		return { success: true, data: attandance };
	} catch (error) {
		return { success: false, error };
	}
}



}


module.exports = new TeacherAttandanceService()