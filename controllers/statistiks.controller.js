const StatistiksService = require('../services/statistiks.service.js')
class StatistiksController {
	async getStatistiks(req, res) {
		try {
			const { studentId } = req.params
			const studentData = await StatistiksService.getStatistiks(studentId)
			if (studentData.success) {
				return res.status(200).json(studentData)
			}
			return res.status(404).json({ studentData })
		} catch (error) {
			res.status(500).json({ message: error, success: false })
		}
	}
	async PaymentStatistiksMonth(req, res) {
		try {
			const studentData = await StatistiksService.PaymentStatistiksMonth(req.query)
			if (studentData.success) {
				return res.status(200).json(studentData)
			}
			return res.status(404).json({ studentData })
		} catch (error) {
			res.status(500).json({ message: error, success: false })
		}
	}
	async TeacherStatistiks(req, res) {
		try {
			console.log(req.query)
			const studentData = await StatistiksService.TeacherStatistiks(req.query)
			if (studentData.success) {
				return res.status(200).json(studentData)
			}
			return res.status(404).json({ studentData })
		} catch (error) {
			res.status(500).json({ message: error, success: false })
		}
	}
}
module.exports = new StatistiksController()