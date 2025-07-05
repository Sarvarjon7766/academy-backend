const teacherPaymentService = require('../services/teacher.payment.service')

class TeacherPaymentController{
	async create(req,res){
		try {
			const data = req.body
			const payment = await teacherPaymentService.create(data)
			if(payment.success){
				res.status(200).json(payment)
			}else{
				res.status(400).json(payment)
			}
		} catch (error) {
			res.status(500).json(error)
		}
	}
	async paymentcheck(req,res){
		try {
			const data = req.query
			const payment = await teacherPaymentService.paymentcheck(data)
			if(payment.success){
				res.status(200).json(payment)
			}else{
				res.status(400).json(payment)
			}
		} catch (error) {
			res.status(500).json(error)
		}
	}
}

module.exports = new TeacherPaymentController()