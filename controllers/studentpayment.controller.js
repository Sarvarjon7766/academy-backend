const StudentPaymentService = require('../services/studentpayment.service')

class StudentPaymentController{
	async paymentCreate(req,res){
		try {
			const payments = await StudentPaymentService.paymentCreate()
			if(payments.success){
				res.status(201).json(payments)
			}else{
				res.status(400).json(payments)
			}
		} catch (error) {
			return res.status(500).json({ message: error, success: false })
		}
	}
}

module.exports = new StudentPaymentController()