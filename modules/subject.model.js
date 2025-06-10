const {model,Schema} = require('mongoose')

const subjectSchema = new Schema({
	subjectName:{
		type:String,
		required:true,
		unique:true
	},
	mainPrice:{
		type:Number,
		required:true
	},
	additionalPrice:{
		type:Number,
		required:false
	}
})

module.exports = new model('subject',subjectSchema)