const { default: mongoose } = require('mongoose')
const registerModel = require('../modules/register.model')
const jwt = require('jsonwebtoken')
class RegisterService{
	async create(data){
		try {	

			const login = data.login
			const exsistUser = await registerModel.findOne({login})
			
			if(exsistUser){
				return {success:false,message:"Bu loginda foydalanuvchi mavjud"}
			}

			const Register = await registerModel.create(data)
			if(Register){
				return {success:true,message:"Yangi foydalanuvchi yaratildi"}
			}
			return {success:false,message:"Foydalanuvchi yaratishda xatolik"}
		} catch (error) {
			throw new Error(error.message)
		}
	}

	async Login(login,password){
		try {
			const user = await registerModel.findOne({login})
			if(!user){
				return {success:false,message:"Foydalanuvchi topilmadi"}
			}
			if(user.password === password && user.isActive){
				const token = jwt.sign({id:user._id,role:user.role,isActive:user.isActive},process.env.SECRET_KEY,{expiresIn:'1h'})
				return {success:true,token,message:"Registratsiya qiluvchi muvafaqiyatli login bo'ldi"}
			}
		return {success:false,message:"Login yoki parol xato"}
		} catch (error) {
			throw new Error(error.message)
		}
	}
	async update(id,data){
		try {
			const updateData = await registerModel.findByIdAndUpdate(id,data,{new:true})
			if(updateData){
				return {success:true,message:"Data update bo'ldi",}
			}
			return {success:false,message:"Update qilishda xatolik"}
		} catch (error) {
			throw new Error(error.message)
		}
	}
	async  isActive(id, active) {
			try {
					const user = await registerModel.findById(id);
					if (!user) {
							return { success: false, message: "Foydalanuvchi topilmadi" };
					}
					if (user.isActive === active) {
							return { success: false, message: "Foydalanuvchi allaqachon shu holatda" };
					}
					user.isActive = active;
					await user.save();
					return { success: true, message: `Foydalanuvchi ${active ? "aktivlashtirildi" : "bloklandi"}` };
			} catch (error) {
					return { success: false, message: `Xatolik: ${error.message}` };
			}
		}

	async deleted(id){
		try {
			await registerModel.findByIdAndDelete(id)
			return {success:true,message:"Foydalauvchi o'chirildi"}
		} catch (error) {
			throw new Error(error.message)
		}
	}
	async getAll(){
		try {
			const register = await registerModel.find({isActive:true})
			console.log(register)
			if(register){
				return {success:true,register,message:"Foydalauvchilar"}
			}
			return {success:false,message:"Foydalanuchilar topilmadi"}
		} catch (error) {
			throw new Error(error.message)
		}
	}
	async getOne(rId){
		try {
			const id = new mongoose.Types.ObjectId(rId)
			const data = await registerModel.findOne({_id:id})
			if(data){
				return {success:true,data,message:"Foydalanuvchi topildi"}
			}
			return {success:false,message:"Bunday foydalanuvchi yo'q"}
		} catch (error) {
			throw new Error(error.message)
		}
	}
}
module.exports = new RegisterService()