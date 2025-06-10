
const EmployerService = require('../services/employer.service')
class EmployerController{
	async create(req,res){
		try {
	
			
			const data = await EmployerService.create(req.body)
	
			if(data.success){
				return res.status(201).json(data)
			}
			return res.status(400).json(data)
		} catch (error) {
			res.status(500).json({ message: error, success: false })
		}
	}
	async getAll(req,res){
		try {
			const data = await EmployerService.getAll()
			if(data.success){
				return res.status(200).json(data)
			}
			return res.status(400).json(data)
		} catch (error) {
			res.status(500).json({ message: error, success: false })
		}
	}

}
module.exports = new EmployerController()