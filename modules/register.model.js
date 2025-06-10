const {model,Schema} = require('mongoose')

const registerSchema = new Schema({
	fullName:{
		type:String,
		required:true
	},
	login:{
		type:String,
		required:true,
		unique:true
	},
	password:{
		type:String,
		required:true
	},
	phone:{
		type:String,
		required:false
	},
	role:{
		type:Number,
		default:2
	},
	isActive:{
		type:Boolean,
		default:true
	}
})

module.exports = model('register',registerSchema)