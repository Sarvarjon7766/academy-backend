const {create,getAll,update,deleted} = require('../services/hostel.service')

class HostelController{
	async create(req,res){
		try {
			const data = req.body
			if(data){
				const hostel = await create(data)
				if(hostel.success){
					return res.status(201).json(hostel)
				}
				return res.status(404).json(hostel)
			}
			return res.status({success:false,message:"Data kelmadi"})
		} catch (error) {
			return res.status(500).json({success:false,message:error})
		}
	}
	async getAll(req,res){
		try {
			const datas = await getAll()
			if(datas.success){
				return res.status(200).json({success:true,hostels:datas.newHostels})
			}
			return res.status(404).json(datas)
		} catch (error) {
			return res.status(500).json({success:false,message:error})
		}
	}
	async update(req,res){
		try {
			const {id} = req.params
			const data = req.body
			if(id && data){
				const addsubject = await update(id,data)
				if(addsubject.success){
					return res.status(200).json(addsubject)
				}
				return res.status(404).json(addsubject)
			}
			return res.status(404).json({success:false,message:"Id va Data kelmadi"})
		} catch (error) {
			return res.status(500).json({success:false,message:error})
		}
	}
	async deleted(req,res){
		try {
			const {id} = req.params
			if(id){
				const deleteData = await deleted(id)
				if(deleteData.success){
					return res.status(200).json(deleteData)
				}
				return res.status(404).json(deleteData)
			}
		} catch (error) {
			return res.status(500).json({success:false,message:error})
		}
	}
	
}
module.exports = new HostelController()