const RoomsService = require('../services/rooms.service')

class RoomsController {
	async create(req, res) {
		try {
			const data = req.body
			const rooms = await RoomsService.create(data)
			if (rooms.success) {
				return res.status(201).json(rooms)
			}
			return res.status(400).json(rooms)
		} catch (error) {
			return res.status(500).json({ success: false, message: error })
		}
	}

	async getAll(req, res) {
		try {
			const data = await RoomsService.GetAll()
			if (data.success) {
				return res.status(200).json(data)
			}
			return res.status(400).json(data)
		} catch (error) {
			return res.status(500).json({ success: false, message: error })
		}
	}
	async CheckStudent(req, res) {
		try {
			const data = await RoomsService.CheckStudent(req.params.studentId)
			if (data.success) {
				return res.status(200).json(data)
			}
			return res.status(200).json(data)
		} catch (error) {
			return res.status(500).json({ success: false, message: error })
		}
	}

	async AddHotelToStudent(req, res) {
		try {
			const data = await RoomsService.AddHotelToStudent(req.params,req.body)
			if (data.success) {
				return res.status(200).json(data)
			}
			return res.status(400).json(data)


		} catch (error) {
			return res.status(500).json({ success: false, message: error })
		}
	}
}

module.exports = new RoomsController()