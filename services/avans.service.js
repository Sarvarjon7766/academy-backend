const avansModel = require('../modules/avans.model')

class AvansService{
	async create(data){
		try {
			const newAvans = await avansModel.create(data)
			if(newAvans){
				return {success:true,message:"Avans qo'shildi",avans:newAvans}
			}
			return {success:false,message:"Avans qo'shishda xatolik mavjud"}
		} catch (error) {
			throw new Error(error.message)
		}
	}
	async getAll(){
		try {
			const Avanses = await avansModel.find()
			if(Avanses){
				return {success:true,avanses:Avanses,message:"Hamma avanslar"}
			}
			return {success:false,message:"Avanslar topilmadi"}
		} catch (error) {
			throw new Error(error.message)
		}
	}
}
module.exports = new AvansService()