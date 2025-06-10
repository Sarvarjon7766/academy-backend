const RegisterService = require('../services/register.service')

class RegisterController{
	async create(req,res){
		try {
			if(req.body){
				const register = await RegisterService.create(req.body)
				register.success ? res.status(201).json(register) : res.status(400).json(register)
			}
		} catch (error) {
			return res.status(500).json({success:false,message:error})
		}
	}
	async Login(req,res){
		try {
			const {login,password} = req.body
			
			if(login && password){
				const data = await RegisterService.Login(login,password)
				data.success ? res.status(200).json(data) : res.status(404).json(data)
			}
			
		} catch (error) {
			return res.status(500).json({success:false,message:error})
		}
	}
	async update(req,res){
		try {
			const data = req.body
			const {id} = req.params
			if(data,id){
				const updateData = await RegisterService.update(id,data)
				updateData.success ? res.status(200).json(updateData) : res.status(400).json(updateData)
			}
		} catch (error) {
			return res.status(500).json({success:false,message:error})
		}
	}
	async getAll(req,res){
		try {
			const datas = await RegisterService.getAll()
			datas.success ? res.status(200).json(datas) : res.status(400).json(datas)
		} catch (error) {
			return res.status(500).json({success:false,message:error})
		}
	}
	async getOne(req,res){
		try {
			let registerId;
			const {id} = req.params
			console.log('ParamsId '+id)
			
			const userId = req.user.id
			console.log('UserId '+userId)
			registerId = id ? id : userId
			console.log('registerId '+registerId)
			if(registerId){
				const data = await RegisterService.getOne(registerId)
				data.success ? res.status(200).json(data) : res.status(400).json(data)
			}
		} catch (error) {
			return res.status(500).json({success:false,message:error})
		}
	}
	async deleted(req,res){
		try {
			const {id} = req.params			
			if(id){
				const data = await RegisterService.deleted(id)
				data.success ? res.status(200).json(data) : res.status(400).json(data)
			}
		} catch (error) {
			return res.status(500).json({success:false,message:error})
		}
	}
	async  isActive(req, res) {
				try {
						const { id } = req.params;
						const { active } = req.body;

						if (!id || active === undefined) {
								return res.status(400).json({ success: false, message: "ID yoki active qiymati yetishmayapti" });
						}
						const data = await RegisterService.isActive(id, active);

						if (!data) {
								return res.status(500).json({ success: false, message: "Server xatosi, ma'lumot qaytmadi" });
						}

						console.log(data);
						return res.status(data.success ? 200 : 400).json(data);
						
				} catch (error) {
						return res.status(500).json({ success: false, message: error.message || "Noma'lum xatolik yuz berdi" });
				}
		}

}

module.exports = new RegisterController()