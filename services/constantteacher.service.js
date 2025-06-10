const constantTeacherModel = require('../modules/constantteacher.model')

class ConstantTeacherService{
	async create(data){
		try {
			const teacher = await constantTeacherModel.create(data)
			if(teacher){
				return {success:true,message:"Teacher yaratildi"}
			}
			return {success:false,message:"Teacher yaratilishida xatolik"}
		} catch (error) {
			throw new Error(error.message)
		}
	}
	
}

module.exports = new ConstantTeacherService()