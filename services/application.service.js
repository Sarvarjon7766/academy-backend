const ApplicationModel = require('../modules/application.model')

class ApplicationService{
	async create(data){
		try {
			if(data){
				const application = await ApplicationModel.create(data)
				
				if(application){
					return {success:true,message:'Arizangiz muvaffaqiyatli yuborildi'}
				}
				return {success:false,message:'Arizangiz yuborilmadi '}
			}
		} catch (error) {
			throw new Error(error)
		}
	}
	async getAll(){
		try {
			const applications = await ApplicationModel.find()
			if(applications){
				return {success:true,applications}
			}
			return {success:false, message:"Hozircha Arizalar mavjud emas "}
		} catch (error) {
			throw new Error(error)
		}
	}
	async update(id, isActive) {
		try {
			const application = await ApplicationModel.findById(id);
	
			// If the application with the given id does not exist
			if (!application) {
				return { success: false, message: 'Ariza topilmadi' };  // Return failure if not found
			}
	
			// Update the isActive status
			application.isActive = isActive;
			await application.save();  // Save changes to the database
	
			return { success: true, message: 'Ariza yangilandi' };  // Return success after update
		} catch (error) {
			throw new Error(error);  // Throw error if something goes wrong
		}
	}
	
	
}

module.exports = new ApplicationService()