const {model,Schema} = require('mongoose')

const productSchema = new Schema({
	productName:{
		type:String,
		required:true
	},
	productPrice:{
		type:Number,
		required:true
	},
	created_at:{
		type:Date,
		default:Date.now
	}
})

module.exports = new model('product',productSchema)