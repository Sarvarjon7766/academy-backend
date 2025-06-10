const {model,Schema} = require('mongoose')

const StudentHostel = new Schema({
	studentId:{
		type:Schema.Types.ObjectId,
		ref:'student',
		required:true
	},
	hostelId:{
		type:Schema.Types.ObjectId,
		ref:'hostel',
		required:true
	},
	hostelNumber:{
		type:Number,
		required:false
	},
	enrollment_date: { 
		type: Date, 
		default: Date.now
	}
})

module.exports = new model('studenthostel',StudentHostel)