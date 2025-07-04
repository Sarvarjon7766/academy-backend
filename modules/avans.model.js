const mongoose = require('mongoose')

const avansSchema = new mongoose.Schema({
	teacherId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'teacher',
		required: true
	},
	teacherName: {
		type: String,
		required: true
	},
	amount: {
		type: Number,
		required: true,
		min: 0
	},
	note: {
		type: String,
		default: ''
	},
	date: {
		type: Date,
		required: false,

	}
}, {
	timestamps: true
})

module.exports = mongoose.model('avans', avansSchema)
