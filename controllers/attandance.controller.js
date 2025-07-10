const AttandanceService = require('../services/attandance.service')

class AttandanceController {
	async create(req, res) {
		try {
			const user = req.user
			const data = req.body			
			const addattandance = await AttandanceService.create(data)
			if (addattandance && addattandance.success) {
				return res.status(201).json(addattandance)
			}
			return res.status(400).json(addattandance)
		} catch (error) {
			return res.status(500).json({ error })
		}
	}
	async createSunday(req, res) {
		try {
			const data = req.body
			const date = new Date(Date.now()).setHours(0, 0, 0, 0)
			const addattandance = await AttandanceService.createSunday({ ...data, date: date })
			if (addattandance && addattandance.success) {
				return res.status(201).json(addattandance)
			}
			return res.status(400).json(addattandance)
		} catch (error) {
			return res.status(500).json({ error })
		}
	}
	async ChekingAttandance(req, res) {
		try {
			const teacherid = req.user.id
			const { groupId } = req.params
			const checking = await AttandanceService.ChekingAttandance(groupId, teacherid)
			if (checking && checking.success) {
				return res.status(200).json(checking)
			}
			return res.status(200).json(checking)
		} catch (error) {
			return res.status(500).json({ error })
		}
	}
	async getAttandanceForYear(req, res) {
		try {
			const { id } = req.user
			const { date } = req.params
			const data = await AttandanceService.getAttandanceForYear(id, date)
			if (data.success) {
				return res.status(200).json(data)
			}
			return res.status(404).json(data)
		} catch (error) {
			return res.status(500).json({ error })
		}
	}
	async lowAchievingStudents(req, res) {
		try {
			const { id } = req.user
			const { date, month } = req.params
			const data = await AttandanceService.lowAchievingStudents(id, date, month)
			if (data.success) {
				return res.status(200).json(data)

			}
			return res.status(404).json(data)
		} catch (error) {
			return res.status(500).json({ error })
		}
	}
	async Calculate(req, res) {
		try {
			const data = await AttandanceService.Calculate(req.query)
			if (data.success) {
				return res.status(200).json(data)

			}
			return res.status(404).json(data)
		} catch (error) {
			return res.status(500).json({ error })
		}
	}
}

module.exports = new AttandanceController()