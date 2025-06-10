const {model,Schema} = require('mongoose')

const constantTeacherSchema = new Schema({
	fullName:{
		type:String,
		required:true
	},
	date_of_birth:{
		type:Date,
		required:false
	},
	gender:{
		type:String,
		enum:["erkak","ayol"]
	},
	address:{
		type:String,
		required:false
	},
	qualification:{
		type:String,
		required:false
	},
	phone:{
		type:String,
		required:false
	},
	salary:{
		type:Number,
		required:false
	},
	photo:{
		type:String,
		required:false
	},
	isConstant:{
		type:Boolean,
		default:false,
		required:true
	},
	createAt:{
		type:Date,
		default:Date.now
	}
})
module.exports = new model('constantteacher',constantTeacherSchema)