const {model,Schema} = require('mongoose')

const teacherSchema = new Schema({
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
		emun:['erkak','Ayol'],
		required:false
	},
	address:{
		type:String,
		required:false
	},
	qualification:{
		type:String,
		required:false
	},
	photo:{
		type:String,
		required:false
	},
	phone:{
		type:String,
		required:false
	},
	subjects: [
		{ 
			type:Schema.Types.ObjectId, 
			ref: "subject" 
		}
	],
	login:{
		type:String,
		required:true,
		unique:true
	},
	password:{
		type:String,
		required:true
	},
	role:{
		type:String,
		default:1
	},
	isAdmin:{
		type:Boolean,
		default:false
	},
	salary:{
		type:Number,
		default:0,
		required:false
	},
	share_of_salary:{
		type:Number,
		default:0,
		required:false
	}
})

module.exports = new model('teacher',teacherSchema)