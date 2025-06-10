const productModel = require('../modules/product.model')

class ProductService{
	async create(data){
		try {
			const product = await productModel.create(data)
			if(product){
				return {success:true,message:"Ma'lumot qo'shildi",product}
			}
			return {success:false,message:"Ma'lumot qo'shilmadi"}
		} catch (error) {
			throw new Error(error.message)
		}
	}
	async update(id,data){
		try {
			const product = await productModel.findByIdAndUpdate(id,data,{new:true})
			if(product){
				return {success:true,message:"Ma'lumot Yangilandi",product}
			}
			return {success:false,message:"Ma'lumot qo'shilmadi"}
		} catch (error) {
			throw new Error(error.message)
		}
	}
	async deleted(id){
		try {
			 await productModel.findByIdAndDelete(id)
				return {success:true,message:"Ma'lumot Yangilandi"}
		} catch (error) {
			throw new Error(error.message)
		}
	}
	async getAll(){
		try {
			const products = await productModel.find()
			if(products){
				return {success:true,message:"Ma'lumot olindi",products}
			}
			return {success:false,message:"Ma'lumot olinmadi"}
		} catch (error) {
			throw new Error(error.message)
		}
	}
}

module.exports = new ProductService()