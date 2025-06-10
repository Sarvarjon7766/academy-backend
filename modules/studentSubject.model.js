const {model,Schema} = require('mongoose')

const studentSubjectSchema = new Schema({
	studentId:{
		type:Schema.Types.ObjectId,
		ref:'student',
		required:true
	},
	subjectId:{
		type:Schema.Types.ObjectId,
		ref:'subject',
		required:true
	},
	subject_price:{
		type:Number,
		required:false
	},
	subject_type:{
		type:Boolean,
		required:true
	},
	enrollment_date: { 
		type: Date, 
		default: Date.now
	}
})

module.exports =new model("StudentSubject", studentSubjectSchema);