const { model, Schema } = require('mongoose')

const employerSchema = new Schema({
	fullName: {
		type: String,
		required: true
	},
	date_of_birth: {
		type: Date,
		required: false
	},
	gender: {
		type: String,
		emun: ['erkak', 'ayol'],
		required: false
	},
	address: {
		type: String,
		required: false
	},
	photo: {
		type: String,
		required: false
	},
	phone: {
		type: String,
		required: false
	},

	login: {
		type: String
	},
	password: {
		type: String,
		required: false
	},
	role: {
		type: Number,
		default: 5
	},
	position: {
		type: String,
		required: true
	},
	salary: {
		type: Number,
		default: 0,
		required: false
	},
	share_of_salary: {
		type: Number,
		default: 0,
		required: false
	},
	status: {
		type: String,
		emun: ['active', 'inactive', 'removed'],
		default: 'active',
		required: true
	},
})

module.exports = new model('employer', employerSchema)