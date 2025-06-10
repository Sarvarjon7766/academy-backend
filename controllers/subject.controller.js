const {create,getAll,update,deleted} = require('../services/subject.service')

class SubjectController{
	async create(req,res){
		try {
			const data = req.body
			const subject = await create(data)
			if(subject.success){
				return res.status(201).json(subject)
			}
			return res.status(404).json(subject)
		} catch (error) {
			return res.status(500).json({
				success:false,
				message:"server error",
				error:error
			})
		}
	}
	async getAll(req,res){
		try {

			const subject = await getAll()
			if(subject.success){
				return res.status(200).json(subject)

			}
			return res.status(404).json(subject)
		} catch (error) {
			return res.status(500).json({
				success:false,
				message:"server error",
				error:error
			})
		}
	}
	async update(req,res){
		try {
			const data = req.body
			const {id} = req.params
			const subject = await update(id,data)
			if(subject.success){
				return res.status(200).json(subject)
			}
			return res.status(404).json(subject)
		} catch (error) {
			return res.status(500).json({
				success:false,
				message:"server error",
				error:error
			})
		}
	}
	async deleted(req,res){
		try {
			const {id} = req.params
			const subject = await deleted(id)
			if(subject.success){
				return res.status(200).json(subject)
			}
			return res.status(404).json(subject)
		} catch (error) {
			return res.status(500).json({
				success:false,
				message:"server error",
				error:error
			})
		}
	}
	async getOne(req,res){
		try {
			const {id} = req.params
			const subject = await getOne(id)
			if(subject.success){
				return res.status(200).json(subject)
			}
			return res.status(404).json(subject)
		} catch (error) {
			return res.status(500).json({
				success:false,
				message:"server error",
				error:error
			})
		}
	}

}

module.exports = new SubjectController()