const { model, Schema } = require('mongoose')

const backupStudentSchema = new Schema({
	fullName: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	old_school: {
		type: String,
		required: true
	},
	old_class: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: false
	},

	main_subjects: [String],
	additionalSubjects: [String],
	groups: [String],

	monthly_payment: {
		type: Number,
		required: false
	},

	role: {
		type: Number,
		default: 2
	}
}, {
	timestamps: true
})

module.exports = new model('student_backup', backupStudentSchema)