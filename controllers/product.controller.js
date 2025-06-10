const ProductService = require('../services/product.service')

class ProductController{
	async create(req,res){
		try {
			const data = req.body
			const product = await ProductService.create(data)
			if(product && product.success){
				return res.status(201).json(product)
			}
			return res.status(400).json(product)
		} catch (error) {
			return res.status(500).json({success:false,error})
		}
	}
	async update(req,res){
		try {
			const data = req.body
			const {id} = req.params
			const product = await ProductService.update(id,data)
			if(product && product.success){
				return res.status(200).json(product)
			}
			return res.status(400).json(product)
		} catch (error) {
			return res.status(500).json({success:false,error})
		}
	}
	async deleted(req,res){
		try {
			const {id} = req.params
			const product = await ProductService.deleted(id)
			if(product && product.success){
				return res.status(201).json(product)
			}
			return res.status(400).json(product)
		} catch (error) {
			return res.status(500).json({success:false,error})
		}
	}
	async getAll(req,res){
		try {
			const product = await ProductService.getAll()
			if(product && product.success){
				return res.status(200).json({success:true,products:product.products})
			}
			return res.status(400).json({success:false,message:product.message})
		} catch (error) {
			return res.status(500).json({success:false,error})
		}
	}
}

module.exports = new ProductController()