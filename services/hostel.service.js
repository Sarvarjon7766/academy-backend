const hostelModel = require('../modules/hostel.model')

class HostelService {
	// Create new subject
	async create(data) {
		try {
			const newHostel = await hostelModel.create(data);
			return { success: true, message: "Yotoq joy yaratildi", newHostel };
		} catch (error) {
			console.error("Error during create:", error);
			return { success: false, message: `Qo'shimcha fan yaratishda xatolik: ${error.message}` };
		}
	}

	// Fetch all subjects
	async getAll() {
		try {
			const newHostels = await hostelModel.find();
			if (newHostels && newHostels.length > 0) {
				return { success: true, newHostels };
			}
			return { success: false, message: "Yotoq-xona topilmadi" };
		} catch (error) {
			console.error("Error during fetch:", error);
			return { success: false, message: `Qo'shimcha fanlarni olishda xatolik: ${error.message}` };
		}
	}

	// Update an existing subject
	async update(id, data) {
		try {
			const updatedData = await hostelModel.findByIdAndUpdate(id, data, { new: true });
			if (updatedData) {
				return { success: true, message: "Joy yangilandi yangilandi", updatedData };
			}
			return { success: false, message: "Fanni yangilashda xatolik: Ma'lumot topilmadi" };
		} catch (error) {
			console.error("Update error:", error);
			return { success: false, message: `Fanni yangilashda xatolik: ${error.message}` };
		}
	}
	async deleted(id){
		try {
			await hostelModel.findByIdAndDelete(id)
			return {success:true,message:"Data o'chirildi"}
		} catch (error) {
			return { success: false, message: `Fanni yangilashda xatolik: ${error.message}` };
		}
	}

}

module.exports = new HostelService();
