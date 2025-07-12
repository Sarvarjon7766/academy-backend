const { mongo, default: mongoose } = require('mongoose')
const studentModel = require('../modules/student.model')
const StudentPaymentService = require('../services/studentpayment.service')

class PaymentController {
	async checkPayment(req, res) {
		try {
			console.log(req.query)
			const data = await StudentPaymentService.check(req.query)
			if (data.success) {
				res.status(200).json(data)
			} else {
				res.status(400).json(data)
			}
		} catch (error) {
			res.status(500).json({ success: false, message: error })
		}
	}
	async resgistratationPaymentHistory(req, res) {
		try {
			const data = await StudentPaymentService.resgistratationPaymentHistory(req.body)
			if (data.success) {
				res.status(200).json(data)
			} else {
				res.status(400).json(data)
			}
		} catch (error) {
			res.status(500).json({ success: false, message: error })
		}
	}
	async StudentBill(req, res) {
		try {
			console.log(req.params)
			const id = new mongoose.Types.ObjectId(req.params.studentId)
			const data = await StudentPaymentService.StudentBill(id)
			if (data.success) {
				res.status(200).json(data)
			} else {
				res.status(400).json(data)
			}
		} catch (error) {
			res.status(500).json({ success: false, message: error })
		}
	}
	async getPayments(req, res) {
		try {
			console.log(req.query)
			const data = await StudentPaymentService.getPayments(req.query)
			if (data.success) {
				res.status(200).json(data)
			} else {
				res.status(400).json(data)
			}
		} catch (error) {
			res.status(500).json({ success: false, message: error })
		}
	}
	async paymentHistory(req, res) {
		try {
			const data = await StudentPaymentService.paymentHistory(req.query)
			if (data.success) {
				res.status(200).json(data)
			} else {
				res.status(400).json(data)
			}
		} catch (error) {
			res.status(500).json({ success: false, message: error })
		}
	}
	async Pay(req, res) {
		try {
			const data = await StudentPaymentService.Pay(req.body)
			if (data.success) {
				res.status(200).json(data)
			} else {
				res.status(400).json(data)
			}
		} catch (error) {
			res.status(500).json({ success: false, message: error })
		}
	}
	async BillPaymentStudent(req, res) {
		try {
			const data = await StudentPaymentService.BillPaymentStudent(req.body)
			if (data.success) {
				res.status(200).json(data)
			} else {
				res.status(400).json(data)
			}
		} catch (error) {
			res.status(500).json({ success: false, message: error })
		}
	}
}

module.exports = new PaymentController()