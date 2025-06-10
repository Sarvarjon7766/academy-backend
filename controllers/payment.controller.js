const PaymentService = require('../services/payment.service')

class PaymentController {
	async create(req, res) {
		try {
			const data = req.body
			const payment = await PaymentService.create(data)
			if (payment && payment.success) {
				return res.status(201).json(payment)
			}
			return res.status(400).json(payment)
		} catch (error) {
			return res.status(500).json({ success: false, message: error.message })
		}
	}
	async getAll(req, res) {
		try {
			const payment = await PaymentService.getAll()
			if (payment && payment.success) {
				return res.status(200).json(payment)
			}
			return res.status(400).json(payment)
		} catch (error) {
			return res.status(500).json({ success: false, message: error.message })
		}
	}
	async checkPayment(req, res) {
		try {
			const payment = await PaymentService.checkPayment(req.query)
			if (payment && payment.success) {
				return res.status(200).json(payment)
			}
			return res.status(400).json(payment)
		} catch (error) {
			return res.status(500).json({ success: false, message: error.message })
		}
	}
	async MonthlyCheck(req, res) {
		try {
			const payment = await PaymentService.MonthlyCheck(req.query)
			if (payment && payment.success) {
				return res.status(200).json(payment)
			}
			return res.status(400).json(payment)
		} catch (error) {
			return res.status(500).json({ success: false, message: error.message })
		}
	}
	async Pay(req, res) {
		try {
			const payment = await PaymentService.Pay(req.body)
			if (payment && payment.success) {
				return res.status(200).json(payment)
			}
			return res.status(400).json(payment)
		} catch (error) {
			return res.status(500).json({ success: false, message: error.message })
		}
	}
	async Calculate(req, res) {
		try {
			const payment = await PaymentService.Calculate(req.body)
			if (payment && payment.success) {
				return res.status(200).json(payment)
			}
			return res.status(400).json(payment)
		} catch (error) {
			return res.status(500).json({ success: false, message: error.message })
		}
	}
	async Balance(req, res) {
		try {
			console.log(req.body)
				return res.status(200).json({success:true,message:"Ok"})

		} catch (error) {
			return res.status(500).json({ success: false, message: error.message })
		}
	}
}

module.exports = new PaymentController()