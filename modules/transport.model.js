const {model,Schema} = require('mongoose')

const transportSchema = new Schema({
	transportName:{
		type:String,
		required:true
	},
	transportPrice:{
		type:Number,
		required:true
	},
	enrollment_date: { 
		type: Date, 
		default: Date.now
	}
})

module.exports = new model('transport',transportSchema)