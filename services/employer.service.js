const employerModel = require('../modules/employer.model')

class EmployerService {
	async create(data) {
		try {
			const login = data.login
			const exsistEmployer = await employerModel.findOne({login})
			if(exsistEmployer){
				return {success:false,message:"bu loginga Hodim biriktirilgan"}
			}
			const upData = { ...data, date_of_birth: new Date(data.date_of_birth), role: 5, status: 'active' }
			const employer = await employerModel.create(data)
			console.log(employer)
			if (employer) {
				return { success: true, message: "Yangi hodim qo'shildi" }
			}
			return { success: false, message: "Yangi hodim qo'shilmadi" }

		} catch (error) {
			return { success: false, message: "Hodim qo'shishda xatolik", error: error }
		}
	}
	async getAll() {
		try {
			const employer = await employerModel.find({ status: 'active' })
			if (employer) {
				return { success: true, employer }
			}
			return { success: false, message: "Hodimlarni olishda xatolik" }

		} catch (error) {
			return { success: false, message: "Hodim qo'shishda xatolik" }
		}
	}
}
module.exports = new EmployerService()