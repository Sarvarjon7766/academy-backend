const {model,Schema} = require('mongoose')

const messageSchema = new Schema({
	messageName:{
		type:String,
		required:true
	},
	messageTitle:{
		type:String,
		required:true
	},
	sent_date:{
		type:Date,
		default:new Date()
	},
	who_is:{
		type:Number,
		default:2
	},
	teacher:{
		type:String,
	}
})

module.exports = model('message',messageSchema)