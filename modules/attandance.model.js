const { model, Schema } = require('mongoose')

const attandanceSchema = new Schema({
	studentId: {
		type: Schema.Types.ObjectId,
		ref: 'student',
		required: true
	},
	groupId: {
		type: Schema.Types.ObjectId,
		ref: 'group',
		required: false
	},
	Status: {
		type: String,
		enum: ["Kelgan", 'Kelmagan'],
		required: true
	},
	score: {
		type: Number,
		min: 0,
		max: 100,
		required: false
	},
	sunday: {
		type: Boolean,
		default: false
	},
	date: {
		type: Date,
		default: () => new Date().setHours(0, 0, 0, 0) // Faqat yil, oy, kun qismi olinadi
	}

})

module.exports = new model('attandance', attandanceSchema)