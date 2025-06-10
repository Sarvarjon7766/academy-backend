const subjectModel = require('../modules/subject.model')

class SubjectService{
	async create(data){
		try {
			const subject = await subjectModel.create(data)
			console.log(subject)
			if(subject){
				return {success:true,message:"Fan yaratildi"}
			}
			return {success:false,message:"Server error"}
		} catch (error) {
			throw new Error(error.message)
		}
	}
	async getAll(){
		try {
			const subject = await subjectModel.find()
			if(subject){
				return {success:true,subject}
			}
			return {success:false,message:"Server error"}
		} catch (error) {
			throw new Error(error.message)
		}
	}
	async update(id,data){
		try {
			const subject = await subjectModel.findByIdAndUpdate(id,data,{new:true})
			if(subject){
				return {success:true,message:"Yangilandi yaratildi"}
			}
			return {success:false,message:"Server error"}
		} catch (error) {
			throw new Error(error.message)
		}
	}
	async deleted(id){
		try {
			if(id){
				await subjectModel.findByIdAndDelete(id)
				return {success:true,message:"O'chirildi yaratildi"}
			}
			return {success:false,message:"Server error"}
		} catch (error) {
			throw new Error(error.message)
		}
	}
}
module.exports = new SubjectService()