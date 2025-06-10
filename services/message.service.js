const messageModel = require('../modules/message.model')

class MessageService{
	async create(data){
		try {
			if(data){
				const message = await messageModel.create(data)
				if(!message){
					return {success:false,message:"Xabar yaratilmadi"}
				}
				return {success:true,message:"Xabar yaratildi"}
			}
		} catch (error) {
			throw new Error(error)
		}
	}
	async getAll(){
		try {
			const messages = await messageModel.find()
			if(!messages){
				return {success:false,message:"Hozircha xabarlar mavjud emas"}
			}
			return {success:true,messages}
		} catch (error) {
			throw new Error(error)
		}

	}
	async getTeacher(){
		try {
			const messages = await messageModel.find({ who_is: { $in: [1, 4] } });
			if(messages){
				return {success:true,messages}
			}
			return {success:false,message:"Ma'lumot toping"}
		} catch (error) {
			throw new Error(error)
		}
	}
	async Personal(user){
		try {
			const messages = await messageModel.find({teacher:user.id});
			if(messages){
				return {success:true,messages}
			}
			return {success:false,message:"Ma'lumot toping"}
		} catch (error) {
			throw new Error(error)
		}
	}
	async deleted(id){
		try {
			if(id){
				await messageModel.findByIdAndDelete(id)
				return {success:true,message:"Xabar o'chirildi"}
			}
			return {success:false,message:"Id kelmadi"}
		} catch (error) {
			throw new Error(error.message)
		}
	}
	async update(id,data){
		try {
			if(id && data){
				await messageModel.findByIdAndUpdate(id,data)
				return {success:true,message:"Xabar o'chirildi"}
			}
			return {success:false,message:"Id kelmadi"}
		} catch (error) {
			throw new Error(error.message)
		}
	}
}

module.exports = new MessageService()