const TransportService = require('../services/transport.service')

class TransportController{
	async create(req,res){
		try {
			const data = req.body
			console.log(data)
			const transport = await TransportService.creste(data)
			if(transport && transport.success){
				return res.status(201).json(transport)
			}
			return res.status(400).json(transport)
		} catch (error) {
			return res.status(500).json({succeess:false,message:error})
		}
	}
	async update(req,res){
		try {
			const data = req.body
			const {id} = req.params
			console.log(data)
			console.log(id)
			const transport = await TransportService.update(id,data)
			if(transport && transport.success){
				console.log(yangilandi)
				return res.status(200).json(transport)
			}
			return res.status(400).json(transport)
		} catch (error) {
			return res.status(500).json({succeess:false,message:error})
		}
	}
	async deleted(req,res){
		try {
			const {id} = req.params
			const transport = await TransportService.deleted(id)
			if(transport && transport.success){
				console.log("O'chirildi")
				return res.status(200).json(transport)
			}
			return res.status(400).json(transport)
		} catch (error) {
			return res.status(500).json({succeess:false,message:error})
		}
	}

	async getAll(req,res){
		try {
			const alldata = await TransportService.getAll()
			if(alldata && alldata.success){
				return res.status(200).json(alldata)
			}
			return res.status(400).json(alldata)
		} catch (error) {
			return res.status(500).json({succeess:false,message:error})
		}
	}
}

module.exports = new TransportController()