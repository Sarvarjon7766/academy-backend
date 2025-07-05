const AvansService = require('../services/avans.service')

class AvansController {
	async create(req, res) {
		try {
			const data = req.body
			const avans = await AvansService.create(data)

			if (avans.success) {
				return res.status(201).json(avans) // ✅ response yuborildi va funksiyadan chiqildi
			} else {
				return res.status(400).json(avans) // ✅ faqat agar success false bo‘lsa
			}
		} catch (error) {
			console.error('Avans create error:', error.message)
			return res.status(500).json({ success: false, message: error.message })
		}
	}

	async getAll(req, res) {
		try {
			const avanses = await AvansService.getAll()

			if (avanses.success) {
				return res.status(200).json(avanses)
			} else {
				return res.status(404).json(avanses)
			}
		} catch (error) {
			console.error('Avans getAll error:', error.message)
			return res.status(500).json({ success: false, message: error.message })
		}
	}
	async teacherAvansInMonth(req, res) {
		try {
			const avans = await AvansService.teacherAvansInMonth(req.query)

			if (avans.success) {
				return res.status(200).json(avans)
			} else {
				return res.status(404).json({success:false,message:"Avansni olishda xatolik mavjud"})
			}
		} catch (error) {
			console.error('Avans getAll error:', error.message)
			return res.status(500).json({ success: false, message: error.message })
		}
	}
}

module.exports = new AvansController()
