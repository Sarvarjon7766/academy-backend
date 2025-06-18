const TeacherAttandanceService = require('../services/TeacherAttandance.service');

class TeacherAttandanceController {
	async attandanceAdd(req, res) {
		try {
			const data = req.body; // Agar siz GET orqali qabul qilayotgan bo‘lsangiz, bu to‘g‘ri
			const attandance = await TeacherAttandanceService.attandanceAdd(data);

			if (attandance.success) {
				return res.status(201).json(attandance);
			}
			return res.status(400).json(attandance);
		} catch (error) {
			// Xatolik bo‘lsa, to‘g‘ri javob qaytarish kerak
			return res.status(500).json({
				success: false,
				message: "Davomat saqlashda xatolik",
				error: error.message || error
			});
		}
	}
	async AllAttandance(req, res) {
		try {
			
			const attandance = await TeacherAttandanceService.AllAttandance();

			if (attandance.success) {
				return res.status(200).json(attandance);
			}
			return res.status(400).json(attandance);
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "Davomat saqlashda xatolik",
				error: error.message || error
			});
		}
	}
}

module.exports = new TeacherAttandanceController();
