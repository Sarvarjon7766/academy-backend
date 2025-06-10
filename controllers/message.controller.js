const {create,getAll,deleted,update,getTeacher,Personal} = require('../services/message.service')

class MessageController{
	async create(req,res){
		try {
			const data = req.body
			console.log(data)
			const message = await create(data)
			if(message.success){
				return res.status(201).json({
					success:true,
					message:message.message
				})
			}
			return res.status(404).json({
				success:false,
				message:"Xabar yaratishda xatolik"
			})
		
		} catch (error) {
			return res.status(500).json({
				success:false,
				message:"Server error",
				error:error.message
			})
		}
	}
	async getAll(req,res){
		try {
			const messages = await getAll()
			if(messages.success){
				return res.status(200).json({success:true,messages:messages.messages})
			}
			return res.status(404).json({success:false,message:"Xabarlar topilmadi"})
		} catch (error) {
			return res.status(500).json({
				success:false,
				message:"Server error",
				error:error.message
			})
		}
	}
	async getTeacher(req,res){
		try {
			const user = req.user
			if(user){
			const message = await getTeacher()
			if(message.success){
				return res.status(200).json(message)
			}
			return res.status(404).json(message)
			}
			return res.status(500).json({success:false,message:"user not found"})
		} catch (error) {
			return res.status(500).json({
				success:false,
				message:"Server error",
				error:error.message
			})
		}
	}
	async Personal(req,res){
		try {
			const user = req.user
			if(user){
			const message = await Personal(user)
			if(message.success){
				return res.status(200).json(message)
			}
			return res.status(404).json(message)
			}
			return res.status(500).json({success:false,message:"user not found"})
		} catch (error) {
			return res.status(500).json({
				success:false,
				message:"Server error",
				error:error.message
			})
		}
	}
	async deleted(req,res){
		try {
			const data = await deleted(req.params.id)
			if(data.success){
				return res.status(200).json({success:true,message:data.message})
			}
			return res.status(404).json({success:false,message:data.message})
		} catch (error) {
			return res.status(500).json({
				success:false,
				message:"Server error",
				error:error.message
			})
		}
	}
	async update(req,res){
		try {
			const data = await update(req.params.id,req.body)
			if(data.success){
				return res.status(200).json(data)
			}
			return res.status(404).json({success:false,message:"server error"})
		} catch (error) {
			return res.status(500).json({
				success:false,
				message:"Server error",
				error:error.message
			})
		}
	}
}
module.exports = new MessageController()