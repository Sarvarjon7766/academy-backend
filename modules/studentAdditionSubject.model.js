const {model,Schema} = require('mongoose')

const StudentAddSchema = new Schema({
	studentId:{
		type:Schema.Types.ObjectId,
		ref:'student',
		required:true
	},
	addSubjectId:{
		type:Schema.Types.ObjectId,
		ref:'addSubject',
		required:true
	}
})

module.exports = new model('studentAddSubject',StudentAddSchema)