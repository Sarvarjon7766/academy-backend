const transportModel = require('../modules/transport.model.js')

class TransportService{
	async creste(data){
		try {
			const transport = await transportModel.create(data)
			return {success:true,message:"Transport ma'lumotlari qo'shildi",transport}
		} catch (error) {
			return {success:false,message:error.message}
			
		}
	}
	async update(id,data){
		try {
			const transport = await transportModel.findByIdAndUpdate(id,data,{new:true})
			return {success:true,message:"Transport ma'lumotlari yangilandi"}
		} catch (error) {
			return {success:false,message:error.message}
			
		}
	}
	async deleted(id){
		try {
			await transportModel.findByIdAndDelete(id)
			return {success:true,message:"Transport ma'lumotlari O'chirildi"}
		} catch (error) {
			return {success:false,message:error.message}
			
		}
	}
	async getAll(){
		try {
			const transports = await transportModel.find()
			if(transports){
				return {success:true,message:"Hamma xarajatlar",transports}
			}
		} catch (error) {
			return {success:false,message:error.message}
		}
	}
}

module.exports = new TransportService()