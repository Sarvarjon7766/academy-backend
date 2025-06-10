const teacherModel = require('../modules/teacher.model')
const registerModel = require('../modules/register.model')
const { default: mongoose } = require('mongoose')

class Profile{
	async getOne(req,res){
		try {
			const user = req.user
			const id = new mongoose.Types.ObjectId(user.id)
			console.log(user)
			if(user.role == 1){
				const teacher = await teacherModel.findOne({_id:id}).select("fullName address phone role") 
				if(teacher){
					return res.status(200).json({success:true,user:teacher})
				}
				console.log(teacher)
				return res.status(404).json({success:false,user:null})
			}else if(user.role == 2){
				const register = await registerModel.findOne({_id:id}).select("fullName  phone role") 
				if(register){
					return res.status(200).json({success:true,user:register})
				}
				console.log(register)
				return res.status(404).json({success:false,user:null})
			}
		} catch (error) {
			throw new Error(error)
		}
	}
}
module.exports =new Profile()